import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { SkincareRoutineRecommendationController } from '@infrastructure/adapters/in/http/SkincareRoutineRecommendationController'
import { logger } from 'src/powertools/utilities'

const skincareRoutineRecommendationController = new SkincareRoutineRecommendationController()

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('Received event', { event })
    
    const result = await skincareRoutineRecommendationController.exec(event)
    
    return result
  } catch (error) {
    logger.error('Error in skincare routine recommendation handler', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    }
  }
}