import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { OpenAI } from '@langchain/openai'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { logger, responseHandler } from 'src/powertools/utilities'
import { z } from 'zod'
export class ProductRecomendationController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      logger.info(`Controller: ${event}`)

      const {  } = JSON.parse(event.body as string)

      const existingProducts = ['bloqueador']
      const userProductsBuyed = ['colonia']
      // const suggestedProducts = []

      // const prefix = `Dado unos curso de entrada, sugiere tres productos relevantes de la siguiente lista 
      //     (IMPORTANTE devuelve sólo los nombres de los productos):
      //   ${formatProductsExisting(existingProducts)}`

      
      // const examplePrompt = new PromptTemplate({
      //   inputVariables: ['completed_courses', 'suggested_courses'],
      //   template: '{completed_courses}\n{suggested_courses}',
      // })


      const outputParser = StructuredOutputParser.fromZodSchema(
        z.array(
          z.object({
            suggestedProduct: z.string().describe('Producto sugerido.'),
            reason: z.string().describe('Motivo por qué el producto es sugerido.'),
          }),
        ),
      )

      const chain = RunnableSequence.from([
        PromptTemplate.fromTemplate(`
          * Actúas como un recomendador de productos avanzado.
          * Solo debes sugerir productos de la siguiente lista (IMPORTANTE: no incluyas productos que no estén en la lista):
          ${existingProducts.map((p) => `\t- ${p}`).join('\n')}
          * Devuelve una lista con los 3 productos recomendados.
          * No puedes añadir productos que el usuario ya ha completado.
          * Añade también el motivo de la sugerencia (IMPORTANTE: Ha de ser en castellano)
          * Ejemplo de respuesta de la razón de la sugerencia: "Porque haciendo el curso de DDD en PHP has demostrado interés en PHP".
          * Devuelve sólo la lista de productos con sus razones, sin añadir información adicional.
          * Siempre respondes utilizando el siguiente JSON Schema:
          {format_instructions}
          * Los productos comprados por el usuario son:
          {products_buyed}
          `
        ),
        new OpenAI({
          modelName: 'gpt-3.5-turbo-0125',
          openAIApiKey: process.env.OPENAI_API_KEY,
        }),
        outputParser,
      ]
      )

      const suggestions = await chain.invoke({
        products_buyed: userProductsBuyed
          .map((course) => `* ${course}`)
          .join('\n'),
        format_instructions: outputParser.getFormatInstructions(),
      })

      console.log(suggestions)
      
      return responseHandler(200, {
        data: suggestions
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}

// const formatProductsExisting = (courses: string[]): string => {
//   return courses.map((course) => `\t- ${course}`).join('\n')
// }