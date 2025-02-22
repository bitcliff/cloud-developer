import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodoItem } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // DONE: Implement creating a new TODO item
    logger.info('Processing event: ', { event: event });
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
    const userId = getUserId(event);
    logger.info(`creating todo item for user ${userId}`);
  
    // Create Todo item
    const item = await createTodoItem(newTodo, userId);

    logger.info(`successfully created new todo item for user ${userId}`);
  
    return {
      statusCode: 201,
      body: JSON.stringify({
        item
      })
    };
  });

handler.use(
  cors({
    credentials: true
  })
)
