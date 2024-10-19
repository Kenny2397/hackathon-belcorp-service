import { AttributeValue, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { config } from '@config/environment'
import { getClient } from '@infrastructure/repositories/DynamoDB/schema/Client'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { logger, responseHandler } from 'src/powertools/utilities'


function fromQuery (items: Record<string, AttributeValue>[]) {
  const response = items.map(item => {
    const data = unmarshall(item)

    delete data.PK,
    delete data.SK
    return data
  })

  return response
}



export class GetClientController implements Handler<APIGatewayProxyEvent, Partial<Context>> {


  async exec (event: APIGatewayProxyEvent) {
    try {
      const path = event.path as unknown
      const { code } = path as { code: string }
      logger.info(`Getting client data for code: ${code}`)
      const client = getClient()
      const command = new QueryCommand({
        TableName: config.userSalesTableName,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: code }
        },
        ScanIndexForward: false
      })
      const response = await client.send(command)
      if (response.Count === 0) {
        return undefined
      }
      return responseHandler(200, {
        data: fromQuery(response.Items!)
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}