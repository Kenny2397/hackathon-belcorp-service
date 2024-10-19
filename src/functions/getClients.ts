import { GetClientsController } from '@infrastructure/adapters/in/http/GetClientsController'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { logger } from 'src/powertools/utilities'

const getClientsController = new GetClientsController()

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
    : Promise<APIGatewayProxyResult | unknown> => {

    logger.logEventIfEnabled(event)

    const res = await getClientsController.exec(event)

    return res
}
