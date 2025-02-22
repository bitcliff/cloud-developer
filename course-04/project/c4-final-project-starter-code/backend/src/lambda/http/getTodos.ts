import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')

// DONE: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event });
    const userId = getUserId(event);
    logger.info(`get all todos for user ${userId}`);
    const todos = await getAllTodos(userId);
    logger.info(`fetched all todos for user ${userId}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    };
  });

handler.use(
  cors({
    credentials: true
  })
)
