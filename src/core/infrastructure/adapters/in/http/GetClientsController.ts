import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { logger, responseHandler } from 'src/powertools/utilities'
import axios from 'axios'

export class GetClientsController implements Handler<APIGatewayProxyEvent, Partial<Context>> {


  async exec (event: APIGatewayProxyEvent) {
    try {
      logger.info('Getting a list of clients')
      const url = 'https://belc-hackathon2023.s3.amazonaws.com/clients.json'
      const response = await axios.get(url)
      return responseHandler(200, {
        data: response.data
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}