import { ProductRecomendationController } from '@infrastructure/adapters/in/http/GetAllPostController'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { logger } from 'src/powertools/utilities'

const productRecomendationController = new ProductRecomendationController(

)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {

  logger.logEventIfEnabled(event)

  const res = await productRecomendationController.exec(event)
  

  return res
}




