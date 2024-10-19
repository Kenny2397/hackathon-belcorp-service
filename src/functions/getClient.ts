import { GetClientController } from '@infrastructure/adapters/in/http/GetClientController'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { logger } from 'src/powertools/utilities'

const getClientController = new GetClientController()

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {

  logger.logEventIfEnabled(event)

  const res = await getClientController.exec(event)

  return res
}
