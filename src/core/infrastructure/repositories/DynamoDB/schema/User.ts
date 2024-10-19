import { AttributeValue, PutItemCommand, QueryCommand, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { config } from '@config/environment'
import { User, UserCount, UserInfo } from '@domain/models/User'
import { CreateUserType, UserProductSuggestionType, } from 'src/core/app/schemas/UserSchema'
import { GenerateError, logger } from 'src/powertools/utilities'
import { ulid } from 'ulid'
import { getClient } from './Client'
import { Item } from './Item'

export class UserDynamoDB extends Item {
  userCode: string
  constructor (userCode: string) {
    super()
    this.userCode = userCode
  }

  get pk () {
    return `USER#${this.userCode}`
  }
  get sk () {
    return `USER#${this.userCode}`
  }

  get skInfo () {
    return 'INFO'
  }

  get skAllProductSug () {
    return 'PROD#SUG'
  }
  
  get skProductSug () {
    return 'PROD#SUG' + ulid()
  }
  
  get skMediaCopy () {
    return 'MEDIA#COPY'
  }

  public keysInfo () {
    return {
      PK: { S: this.pk },
      SK: { S: this.skInfo }
    }
  }

  public keysProdSug () {
    return {
      PK: { S: this.pk },
      SK: { S: this.skProductSug }
    }
  }

  // public keysCount () {
  //   return {
  //     PK: { S: this.pk },
  //     SK: { S: this.skCount }
  //   }
  // }

  static fromQuery (items: Record<string, AttributeValue>[]) {
    const response = {
      count: {},
      info: {}
    } as User

    items.map(item => {
      const userdata = unmarshall(item)
      const SK = userdata.SK

      delete userdata.PK,
      delete userdata.SK

      if (SK === 'COUNT') {
        response.count = userdata as UserCount
      } else {
        response.info = userdata as UserInfo
      }
    })

    return response
  }

  static async createUserInfo (userData: CreateUserType) {
    const client = getClient()

    const user = new UserDynamoDB(userData.cod_cliente)
    
    try {

      let params = {
        TransactItems: [
          {
            Put: {
              TableName: config.userRecordInteractionTableName,
              Item: {
                ...user.keysInfo(),
                cod_cliente: { S: userData.cod_cliente },
                createdAt: { S: new Date().toISOString() },
                updatedAt: { S: new Date().toISOString() }
              },
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          },
          
        ]
      }

      const command = new TransactWriteItemsCommand(params)
      
      const response = await client.send(command)
      logger.debug('createUserInfo : command - response', { command, response })
    
      return userData.cod_cliente
    } catch (error) {
      logger.error('createUserInfo - error', { error })
      throw new GenerateError(400, { detail: 'User already exist' })
    }
  }

  static async CreateProductSuggestion (data : UserProductSuggestionType) {

    const client = getClient()

    const user = new UserDynamoDB(data.cod_cliente)

    const command = new PutItemCommand({
      TableName: config.userRecordInteractionTableName,
      Item: {
        ...user.keysValue(),
        id: { S: user.userCode },
        productsBuyed: { L: marshall(data.productSuggestions?.productsBuyed) },
        productsSuggested: { L: marshall(data.productSuggestions?.productsSuggested) },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() }
      }
    })
    try {
      const response = await client.send(command)
      logger.debug('createpost command - response', { command, response })

      return user.userCode
    } catch (error) {
      logger.error('createpost - error', { error })
      throw new GenerateError(500, { detail: 'Error creating post' })
    }
  }


  static async getUser (userCode: string) {
    const client = getClient()
    const user = new UserDynamoDB(userCode)

    const command = new QueryCommand({
      TableName: config.userRecordInteractionTableName,
      KeyConditionExpression: 'PK = :userCode',
      ExpressionAttributeValues: {
        ':userCode': { S: user.pk }
      }
    })

    try {
      const response = await client.send(command)
      logger.debug('getUser - response', { command, response })

      if (response.Count === 0) {
        return undefined
      }

      return this.fromQuery(response.Items!)
    }
    catch (error) {
      logger.error('getUser - error', { error })
      throw new GenerateError(500, { detail: 'Error getting user' })
    }
  }
}