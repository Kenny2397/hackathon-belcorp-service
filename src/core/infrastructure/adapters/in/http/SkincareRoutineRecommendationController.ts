import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { logger, responseHandler } from 'src/powertools/utilities'
import { z } from 'zod'
import { products, userProductsBuyed } from '../../../constants/products'

export class SkincareRoutineRecommendationController implements Handler<APIGatewayProxyEvent, Partial<Context>> {
  constructor() {}

  async exec(event: APIGatewayProxyEvent) {
    try {
      logger.info(`Controller: ${JSON.stringify(event.body)}`)

      let eventBody;
      if (typeof event.body === 'string') {
        eventBody = JSON.parse(event.body);
      } else if (typeof event.body === 'object') {
        eventBody = event.body;
      } else {
        throw new Error('Invalid event body');
      }

      const { username } = eventBody;

      if (!username) {
        return responseHandler(400, { message: "Username is required" });
      }

      const skincareProducts = products.filter(p => 
        p.descategoria === 'TRATAMIENTO FACIAL' || 
        p.descategoria === 'CUIDADO PERSONAL'
      )

      const userSkincareProducts = userProductsBuyed.filter(p => 
        p.descategoria === 'TRATAMIENTO FACIAL' || 
        p.descategoria === 'CUIDADO PERSONAL'
      )

      const outputParser = StructuredOutputParser.fromZodSchema(
        z.object({
          morningRoutine: z.array(z.object({
            step: z.string(),
            product: z.string(),
            reason: z.string()
          })),
          eveningRoutine: z.array(z.object({
            step: z.string(),
            product: z.string(),
            reason: z.string()
          })),
          weeklyTreatments: z.array(z.object({
            treatment: z.string(),
            product: z.string(),
            reason: z.string()
          })),
          personalizedTips: z.array(z.string())
        })
      )

      const chain = RunnableSequence.from([
        PromptTemplate.fromTemplate(`
          Actúa como un experto en cuidado de la piel y cosmetólogo personal para {username}.
          
          Productos de cuidado de la piel disponibles:
          {available_products}

          Productos de cuidado de la piel que {username} ya ha comprado:
          {user_products}

          Basándote en esta información, crea una rutina de cuidado de la piel personalizada y atractiva para {username}. La rutina debe ser fácil de seguir y debe explicar por qué cada producto es beneficioso. Usa un tono amigable y motivador, e incluye emojis para hacer la rutina más atractiva.

          Incluye:
          1. Una rutina matutina
          2. Una rutina nocturna

          Asegúrate de recomendar productos que {username} ya ha comprado, y complementa con nuevos productos cuando sea necesario (obtenlos de la lista de productos). Explica brevemente por qué cada producto es recomendado.
          Asegurate de no recomendar productos que no existan dentro del {available_products}.

          Formato de respuesta:
          {format_instructions}
        `),
        new ChatOpenAI({
          modelName: 'gpt-4',
          openAIApiKey: process.env.OPENAI_API_KEY,
          temperature: 0.7
        }),
        outputParser,
      ])

      const recommendation = await chain.invoke({
        username,
        available_products: this.formatProducts(skincareProducts),
        user_products: this.formatProducts(userSkincareProducts),
        format_instructions: outputParser.getFormatInstructions(),
      })

      logger.info('Skincare routine recommendation', { recommendation })
      
      return responseHandler(200, {
        data: recommendation
      })
    } catch (error) {
      logger.error('Error in skincare routine recommendation', error);
      return responseHandler(500, null, error as Error)
    }
  }

  private formatProducts(products): string {
    return products.map(p => `- ${p.desproducto} (${p.descategoria})`).join('\n')
  }
}