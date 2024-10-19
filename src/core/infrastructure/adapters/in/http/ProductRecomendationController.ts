import { UserDynamoDB } from '@infrastructure/repositories/DynamoDB/schema/User'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import axios from 'axios'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { ProductSuggestionSchema } from 'src/core/app/schemas/PostSchema'
import { logger, responseHandler } from 'src/powertools/utilities'
import { z } from 'zod'
export class ProductRecomendationController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      logger.info(`Controller: ${event.body}`)

      const eventBody = ProductSuggestionSchema.parse(event.body)
      const { cod_cliente, des_nombre_cliente, suggestedProductsCount } = eventBody
      logger.info(cod_cliente ?? 'C66Z5')
      const username = des_nombre_cliente
      const suggested_products_count = suggestedProductsCount ?? 3
      
      // const config: AxiosRequestConfig = {
      //   method: 'get',
      //   url: 'https://api-qa.belcorp.biz/oauth/token',
      //   headers: { 
      //     'Content-Type': 'application/x-www-form-urlencoded', 
      //     'Authorization': 'Basic QUtJQVlZSkpTWEdGUlJBT0xGWDU6SGlsdWpjaFJDMGpVdCtVKzlIajhjdElhUW5XUFJabmVnRUVPT1ZtRDBKRT0='
      //   },
      //   // data: data
      // }
      
      // const resCredentials = axios(config)
      //   .then((response) => {
      //     console.log(response.data)
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //   })
      const userData = await axios.get(`${process.env.BELCORP_MICROSERVICE}/clients/${cod_cliente}`).then(
        res => res.data.body.data[0].sales
      )

      console.log('userData', userData)
      const allProducts = await axios.get('https://belc-hackathon2023.s3.amazonaws.com/products.json').then(
        res => res.data
      )
      console.log(allProducts)

      const existingProducts = allProducts as {
        descategoria: string
        codsap: string,
        desclase: string,
        volumen: string,
        desgrupoarticulo: string,
        ancho: string,
        pesobruto: string,
        desunidadnegocio: string,
        largo: string,
        desproducto: string,
        desmarca: string
      }[]

      // const userProductsBuyed = [
      //   {
      //     'descategoria': 'TRATAMIENTO FACIAL',
      //     'codsap': '200111234',
      //     'desclase': 'TRATAMIENTO FACIAL',
      //     'volumen': '182',
      //     'desgrupoarticulo': 'TRATAMIENTO FACIAL',
      //     'ancho': '41',
      //     'pesobruto': '142',
      //     'desunidadnegocio': 'COSMETICOS',
      //     'largo': '41',
      //     'desproducto': 'ES TAC SUERO MULTIB 28ML',
      //     'desmarca': 'ESIKA'
      //   },
      //   {
      //     'descategoria': 'FRAGANCIAS',
      //     'codsap': '200098377',
      //     'desclase': 'FRAGANCIAS',
      //     'volumen': '449',
      //     'desgrupoarticulo': 'FRAGANCIAS',
      //     'ancho': '44',
      //     'pesobruto': '328',
      //     'desunidadnegocio': 'COSMETICOS',
      //     'largo': '100',
      //     'desproducto': 'ES KROMO BLACK PARF 90 ML',
      //     'desmarca': 'ESIKA'
      //   },
      //   {
      //     'descategoria': 'TRATAMIENTO FACIAL',
      //     'codsap': '200107850',
      //     'desclase': 'TRATAMIENTO FACIAL',
      //     'volumen': '212',
      //     'desgrupoarticulo': 'TRATAMIENTO FACIAL',
      //     'ancho': '42',
      //     'pesobruto': '130',
      //     'desunidadnegocio': 'COSMETICOS',
      //     'largo': '42',
      //     'desproducto': 'LB CONCE TO SUERO AH TER 30ML',
      //     'desmarca': 'LBEL'
      //   },
      //   {
      //     'descategoria': 'CUIDADO PERSONAL',
      //     'codsap': '210100407',
      //     'desclase': 'CUIDADO PERSONAL',
      //     'volumen': '406',
      //     'desgrupoarticulo': 'CUIDADO PERSONAL',
      //     'ancho': '53',
      //     'pesobruto': '207',
      //     'desunidadnegocio': 'COSMETICOS',
      //     'largo': '53',
      //     'desproducto': 'CZ TRAX DES MAKEOUT CC 103G',
      //     'desmarca': 'CYZONE'
      //   },
      //   {
      //     'descategoria': 'FRAGANCIAS',
      //     'codsap': '200092025',
      //     'desclase': 'FRAGANCIAS',
      //     'volumen': '379',
      //     'desgrupoarticulo': 'FRAGANCIAS',
      //     'ancho': '42',
      //     'pesobruto': '217',
      //     'desunidadnegocio': 'COSMETICOS',
      //     'largo': '42',
      //     'desproducto': 'CZ MISEXY PROVO COLONIA 200 ML',
      //     'desmarca': 'CYZONE'
      //   },
      //   {
      //     'descategoria': 'MAQUILLAJE',
      //     'codsap': '200103394',
      //     'desclase': 'MAQUILLAJE',
      //     'volumen': '67',
      //     'desgrupoarticulo': 'MAQUILLAJE',
      //     'ancho': '23',
      //     'pesobruto': '35',
      //     'desunidadnegocio': 'COSMETICOS',
      //     'largo': '23',
      //     'desproducto': 'ES PRO FULL BSTR  FR NEGRO',
      //     'desmarca': 'ESIKA'
      //   },
      //   {
      //     'descategoria': 'FRAGANCIAS',
      //     'codsap': '200106357',
      //     'desclase': 'FRAGANCIAS',
      //     'volumen': '291',
      //     'desgrupoarticulo': 'FRAGANCIAS',
      //     'ancho': '49',
      //     'pesobruto': '226',
      //     'desunidadnegocio': 'COSMETICOS',
      //     'largo': '55',
      //     'desproducto': 'CZ AUTENTIK EDP 45 ML',
      //     'desmarca': 'CYZONE'
      //   }
      // ]
      let allProducts2 = [] as {
        descategoria: string
        codsap: string,
        desclase: string,
        volumen: string,
        desgrupoarticulo: string,
        ancho: string,
        pesobruto: string,
        desunidadnegocio: string,
        largo: string,
        desproducto: string,
        desmarca: string
      }[]

      userData.map((i: { products: any[] }) => {
        i.products.map(p => {
          allProducts2.push(p)
        })
      })
      
      const userProductsBuyed = userData as {
        descategoria: string
        codsap: string,
        desclase: string,
        volumen: string,
        desgrupoarticulo: string,
        ancho: string,
        pesobruto: string,
        desunidadnegocio: string,
        largo: string,
        desproducto: string,
        desmarca: string
      }[]

      console.log(username, suggested_products_count, userProductsBuyed)

      const outputParser = StructuredOutputParser.fromZodSchema(
        z.array(
          z.object({
            suggestedProduct: z.object({
              categoria: z.string().describe('categoria del producto'),
              clase: z.string().describe('clase del producto'),
              grupoArticulo: z.string().describe('grupo del producto'),
              unidadNegocio: z.string().describe('unidad de negocio del producto'),
              producto: z.string().describe('descripcion del producto'),
              marca: z.string().describe('marca del producto'),
            }).describe('Producto sugerido.'),
            reason: z.string().describe('Motivo por qué el producto es sugerido.'),
          }),
        ),
      )

      const chain = RunnableSequence.from([
        PromptTemplate.fromTemplate(`
          * Actúas como un recomendador de productos avanzado.
          * Solo debes sugerir productos de la siguiente lista (IMPORTANTE: no incluyas productos que no estén en la lista):
          ${existingProducts.map((p) => `\t- ${p.descategoria}-${p.desclase}-${p.desgrupoarticulo}-${p.desunidadnegocio}-${p.desproducto}-${p.desmarca}`).join('\n')}
          * cada elemento tiene la siguiente estructura: categoria-clase-grupoarticulo-unidadnegocio-producto-marca en ese orden 
          * Devuelve una lista con los {suggested_products_count} productos recomendados.
          * No puedes añadir productos que el usuario ya ha completado.
          * Añade también el motivo de la sugerencia (IMPORTANTE: Ha de ser en castellano)
          * Ejemplo de respuesta de la razón de la sugerencia: "Porque haciendo el curso de DDD en PHP has demostrado interés en PHP".
          * Devuelve sólo la lista de productos con sus razones, sin añadir información adicional.
          * la razon debe ser mas como una recomendacion con un tono cercano, usa emojis para generar confianza y personalizar la respuesta al usuario {username} mencionando su nombre 
          * Siempre respondes utilizando el siguiente JSON Schema:
          {format_instructions}
          * Los productos comprados por el usuario son:
          {products_buyed}
          `
        ),
        new ChatOpenAI({
          modelName: 'gpt-4o-mini',
          openAIApiKey: process.env.OPENAI_API_KEY,
          temperature: 0.4
        }),
        outputParser,
      ]
      )

      logger.info('product recomendation', { chain } )

      const suggestions = await chain.invoke({
        username,
        suggested_products_count,
        products_buyed: userProductsBuyed
          .map((p) => {
            
            return `* ${p.descategoria}-${p.desclase}-${p.desgrupoarticulo}-${p.desunidadnegocio}-${p.desproducto}-${p.desmarca}`
          })
          .join('\n'),
        format_instructions: outputParser.getFormatInstructions(),
      })

      console.log(suggestions)
      

      const user = await UserDynamoDB.getUser(cod_cliente!)

      if (!user) {
        await UserDynamoDB.createUserInfo({
          cod_cliente: cod_cliente!
        })
      }
      console.log(userProductsBuyed, suggestions)
      await UserDynamoDB.CreateProductSuggestion({
        cod_cliente: cod_cliente!,
        productSuggestions: {
          productsBuyed: userProductsBuyed,
          productsSuggested: suggestions
        }
      })

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