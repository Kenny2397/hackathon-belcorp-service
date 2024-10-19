import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
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
      const { username, suggestedProductsCount } = eventBody

      const suggested_products_count = suggestedProductsCount ?? 3

      const existingProducts = [
        {
          'codsap': '200111234',
          'desproducto': 'ES TAC SUERO MULTIB 28ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'TRATAMIENTO FACIAL',
          'desgrupoarticulo': 'TRATAMIENTO FACIAL',
          'desclase': 'TRATAMIENTO FACIAL',
          'largo': '41',
          'ancho': '41',
          'volumen': '182',
          'pesobruto': '142'
        },
        {
          'codsap': '200098377',
          'desproducto': 'ES KROMO BLACK PARF 90 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '100',
          'ancho': '44',
          'volumen': '449',
          'pesobruto': '328'
        },
        {
          'codsap': '200107850',
          'desproducto': 'LB CONCE TO SUERO AH TER 30ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'LBEL',
          'descategoria': 'TRATAMIENTO FACIAL',
          'desgrupoarticulo': 'TRATAMIENTO FACIAL',
          'desclase': 'TRATAMIENTO FACIAL',
          'largo': '42',
          'ancho': '42',
          'volumen': '212',
          'pesobruto': '130'
        },
        {
          'codsap': '210100407',
          'desproducto': 'CZ TRAX DES MAKEOUT CC 103G',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'CYZONE',
          'descategoria': 'CUIDADO PERSONAL',
          'desgrupoarticulo': 'CUIDADO PERSONAL',
          'desclase': 'CUIDADO PERSONAL',
          'largo': '53',
          'ancho': '53',
          'volumen': '406',
          'pesobruto': '207'
        },
        {
          'codsap': '200092025',
          'desproducto': 'CZ MISEXY PROVO COLONIA 200 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'CYZONE',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '42',
          'ancho': '42',
          'volumen': '379',
          'pesobruto': '217'
        },
        {
          'codsap': '200103394',
          'desproducto': 'ES PRO FULL BSTR  FR NEGRO',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'MAQUILLAJE',
          'desgrupoarticulo': 'MAQUILLAJE',
          'desclase': 'MAQUILLAJE',
          'largo': '23',
          'ancho': '23',
          'volumen': '67',
          'pesobruto': '35'
        },
        {
          'codsap': '200106357',
          'desproducto': 'CZ AUTENTIK EDP 45 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'CYZONE',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '55',
          'ancho': '49',
          'volumen': '291',
          'pesobruto': '226'
        },
        {
          'codsap': '200110157',
          'desproducto': 'ES KROMO FIRE PARF 90 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '100',
          'ancho': '44',
          'volumen': '449',
          'pesobruto': '328'
        },
        {
          'codsap': '200113891',
          'desproducto': 'ES PULSO EDT EDL 100 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '63',
          'ancho': '49',
          'volumen': '509',
          'pesobruto': '328'
        },
        {
          'codsap': '200106556',
          'desproducto': 'CZ CYP MASC SECRET LASH 5.8 G',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'CYZONE',
          'descategoria': 'MAQUILLAJE',
          'desgrupoarticulo': 'MAQUILLAJE',
          'desclase': 'MAQUILLAJE',
          'largo': '13',
          'ancho': '13',
          'volumen': '20',
          'pesobruto': '15'
        },
        {
          'codsap': '200113464',
          'desproducto': 'CZ ACAI BOMB COL 200 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'CYZONE',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '42',
          'ancho': '42',
          'volumen': '379',
          'pesobruto': '217'
        },
        {
          'codsap': '200106488',
          'desproducto': 'CZ SKIN F CR OJOS DETOX 15G',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'CYZONE',
          'descategoria': 'TRATAMIENTO FACIAL',
          'desgrupoarticulo': 'TRATAMIENTO FACIAL',
          'desclase': 'TRATAMIENTO FACIAL',
          'largo': '31',
          'ancho': '19',
          'volumen': '78',
          'pesobruto': '24'
        },
        {
          'codsap': '200104255',
          'desproducto': 'ES YOU LIVE EDT CC 90 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '62',
          'ancho': '32',
          'volumen': '321',
          'pesobruto': '260'
        },
        {
          'codsap': '200087691',
          'desproducto': 'ES STAR PROT SOL R&C 80 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'TRATAMIENTO CORPORAL',
          'desgrupoarticulo': 'TRATAMIENTO CORPORAL',
          'desclase': 'TRATAMIENTO CORPORAL',
          'largo': '73',
          'ancho': '40',
          'volumen': '345',
          'pesobruto': '130'
        },
        {
          'codsap': '200114991',
          'desproducto': 'LB MITHYKA LOC PERF CC 130 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'LBEL',
          'descategoria': 'TRATAMIENTO CORPORAL',
          'desgrupoarticulo': 'TRATAMIENTO CORPORAL',
          'desclase': 'TRATAMIENTO CORPORAL',
          'largo': '56',
          'ancho': '42',
          'volumen': '640',
          'pesobruto': '152'
        },
        {
          'codsap': '200099047',
          'desproducto': 'ES KALOS SPORT EDT CC 100ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '74',
          'ancho': '45',
          'volumen': '448',
          'pesobruto': '300'
        },
        {
          'codsap': '200106346',
          'desproducto': 'ES FIORI PARFUM CC 50ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '39',
          'ancho': '39',
          'volumen': '254',
          'pesobruto': '193'
        },
        {
          'codsap': '200106354',
          'desproducto': 'LB BLEU GLACIAL PARF 100ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'LBEL',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '89',
          'ancho': '45',
          'volumen': '503',
          'pesobruto': '353'
        },
        {
          'codsap': '200106392',
          'desproducto': 'ES YOU EDT COL CC 50 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '51',
          'ancho': '30',
          'volumen': '194',
          'pesobruto': '156'
        },
        {
          'codsap': '200102089',
          'desproducto': 'CZ SL LL LIQ CCG DEEP RED',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'CYZONE',
          'descategoria': 'MAQUILLAJE',
          'desgrupoarticulo': 'MAQUILLAJE',
          'desclase': 'MAQUILLAJE',
          'largo': '15',
          'ancho': '15',
          'volumen': '24',
          'pesobruto': '16'
        },
        {
          'codsap': '200106440',
          'desproducto': 'ES CFX 24H PIMIENTA CALIENTE',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'MAQUILLAJE',
          'desgrupoarticulo': 'MAQUILLAJE',
          'desclase': 'MAQUILLAJE',
          'largo': '15',
          'ancho': '15',
          'volumen': '24',
          'pesobruto': '14'
        },
        {
          'codsap': '200110328',
          'desproducto': 'ES CFX DUO PIMIENTA CALIENTE',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'MAQUILLAJE',
          'desgrupoarticulo': 'MAQUILLAJE',
          'desclase': 'MAQUILLAJE',
          'largo': '16',
          'ancho': '16',
          'volumen': '34',
          'pesobruto': '16'
        },
        {
          'codsap': '200106295',
          'desproducto': 'ES MIA SENS NG PARF 45 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '63',
          'ancho': '36',
          'volumen': '299',
          'pesobruto': '226'
        },
        {
          'codsap': '210102594',
          'desproducto': 'CY MINI BOLSO NURELIA',
          'desunidadnegocio': 'MODA',
          'desmarca': 'CYZONE',
          'descategoria': 'COMPLEMENTOS',
          'desgrupoarticulo': 'COMPLEM. DE VESTIR',
          'desclase': 'COMPLEM. DE VESTIR',
          'largo': '200',
          'ancho': '60',
          'volumen': '2400',
          'pesobruto': '250'
        },
        {
          'codsap': '200113892',
          'desproducto': 'ES YOU REACO EDT CO 50 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '51',
          'ancho': '30',
          'volumen': '194',
          'pesobruto': '156'
        },
        {
          'codsap': '200091530',
          'desproducto': 'ES D\'ORSAY INFINITE PARF 90ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'ESIKA',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '83',
          'ancho': '38',
          'volumen': '426',
          'pesobruto': '288'
        },
        {
          'codsap': '200101110',
          'desproducto': 'LB NOCTURNE SERUM CC 30ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'LBEL',
          'descategoria': 'TRATAMIENTO FACIAL',
          'desgrupoarticulo': 'TRATAMIENTO FACIAL',
          'desclase': 'TRATAMIENTO FACIAL',
          'largo': '46',
          'ancho': '35',
          'volumen': '227',
          'pesobruto': '148'
        },
        {
          'codsap': '200101369',
          'desproducto': 'LB MITHYKA ELIXIR PARFUM 50 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'LBEL',
          'descategoria': 'FRAGANCIAS',
          'desgrupoarticulo': 'FRAGANCIAS',
          'desclase': 'FRAGANCIAS',
          'largo': '45',
          'ancho': '42',
          'volumen': '292',
          'pesobruto': '226'
        },
        {
          'codsap': '200100855',
          'desproducto': 'CZ SKIN F BLOQUEADOR 50 ML',
          'desunidadnegocio': 'COSMETICOS',
          'desmarca': 'CYZONE',
          'descategoria': 'TRATAMIENTO FACIAL',
          'desgrupoarticulo': 'TRATAMIENTO FACIAL',
          'desclase': 'TRATAMIENTO FACIAL',
          'largo': '47',
          'ancho': '30',
          'volumen': '171',
          'pesobruto': '63'
        }
      ]

      const userProductsBuyed = [
        {
          'descategoria': 'TRATAMIENTO FACIAL',
          'codsap': '200111234',
          'desclase': 'TRATAMIENTO FACIAL',
          'volumen': '182',
          'desgrupoarticulo': 'TRATAMIENTO FACIAL',
          'ancho': '41',
          'pesobruto': '142',
          'desunidadnegocio': 'COSMETICOS',
          'largo': '41',
          'desproducto': 'ES TAC SUERO MULTIB 28ML',
          'desmarca': 'ESIKA'
        },
        {
          'descategoria': 'FRAGANCIAS',
          'codsap': '200098377',
          'desclase': 'FRAGANCIAS',
          'volumen': '449',
          'desgrupoarticulo': 'FRAGANCIAS',
          'ancho': '44',
          'pesobruto': '328',
          'desunidadnegocio': 'COSMETICOS',
          'largo': '100',
          'desproducto': 'ES KROMO BLACK PARF 90 ML',
          'desmarca': 'ESIKA'
        },
        {
          'descategoria': 'TRATAMIENTO FACIAL',
          'codsap': '200107850',
          'desclase': 'TRATAMIENTO FACIAL',
          'volumen': '212',
          'desgrupoarticulo': 'TRATAMIENTO FACIAL',
          'ancho': '42',
          'pesobruto': '130',
          'desunidadnegocio': 'COSMETICOS',
          'largo': '42',
          'desproducto': 'LB CONCE TO SUERO AH TER 30ML',
          'desmarca': 'LBEL'
        },
        {
          'descategoria': 'CUIDADO PERSONAL',
          'codsap': '210100407',
          'desclase': 'CUIDADO PERSONAL',
          'volumen': '406',
          'desgrupoarticulo': 'CUIDADO PERSONAL',
          'ancho': '53',
          'pesobruto': '207',
          'desunidadnegocio': 'COSMETICOS',
          'largo': '53',
          'desproducto': 'CZ TRAX DES MAKEOUT CC 103G',
          'desmarca': 'CYZONE'
        },
        {
          'descategoria': 'FRAGANCIAS',
          'codsap': '200092025',
          'desclase': 'FRAGANCIAS',
          'volumen': '379',
          'desgrupoarticulo': 'FRAGANCIAS',
          'ancho': '42',
          'pesobruto': '217',
          'desunidadnegocio': 'COSMETICOS',
          'largo': '42',
          'desproducto': 'CZ MISEXY PROVO COLONIA 200 ML',
          'desmarca': 'CYZONE'
        },
        {
          'descategoria': 'MAQUILLAJE',
          'codsap': '200103394',
          'desclase': 'MAQUILLAJE',
          'volumen': '67',
          'desgrupoarticulo': 'MAQUILLAJE',
          'ancho': '23',
          'pesobruto': '35',
          'desunidadnegocio': 'COSMETICOS',
          'largo': '23',
          'desproducto': 'ES PRO FULL BSTR  FR NEGRO',
          'desmarca': 'ESIKA'
        },
        {
          'descategoria': 'FRAGANCIAS',
          'codsap': '200106357',
          'desclase': 'FRAGANCIAS',
          'volumen': '291',
          'desgrupoarticulo': 'FRAGANCIAS',
          'ancho': '49',
          'pesobruto': '226',
          'desunidadnegocio': 'COSMETICOS',
          'largo': '55',
          'desproducto': 'CZ AUTENTIK EDP 45 ML',
          'desmarca': 'CYZONE'
        }
      ]
      // const suggestedProducts = []

      // const prefix = `Dado unos curso de entrada, sugiere tres productos relevantes de la siguiente lista 
      //     (IMPORTANTE devuelve sólo los nombres de los productos):
      //   ${formatProductsExisting(existingProducts)}`

      
      // const examplePrompt = new PromptTemplate({
      //   inputVariables: ['completed_courses', 'suggested_courses'],
      //   template: '{completed_courses}\n{suggested_courses}',
      // })

      console.log(username, suggested_products_count)

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
          .map((p) => `* ${p.descategoria}-${p.desclase}-${p.desgrupoarticulo}-${p.desunidadnegocio}-${p.desproducto}-${p.desmarca}`)
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