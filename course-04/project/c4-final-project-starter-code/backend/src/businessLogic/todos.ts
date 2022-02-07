import { TodosAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';
import { FileAccess } from '../dataLayer/fileAccess';

// DONE: Implement businessLogic
const logger = createLogger('Todos')
const todosAccess = new TodosAccess();
const fileAccess = new FileAccess();

export async function createAttachmentPresignedUrl(userId: string, todoId: string): Promise<String> {
    const uploadUrl = await fileAccess.getUploadUrl(todoId);
    logger.info(`upload url is ${uploadUrl}`)
    const attachmentUrl = fileAccess.getAttachmentUrl(todoId);
    logger.info(`attachmentUrl is ${attachmentUrl}`)
    await todosAccess.updateAttachmentUrl(userId, todoId, attachmentUrl);
    logger.info(`updated attachment url for todo ${todoId} of user ${userId}`)
    return uploadUrl;
}

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todosAccess.getAllTodos(userId);
}

export async function createTodoItem(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info('Creating new Todo for user ', userId);

    const todoId = uuid.v4();
    const timestamp = new Date().toISOString();

    return await todosAccess.createTodoItem({
        userId: userId,
        todoId: todoId,
        createdAt: timestamp,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    });
}

export async function updateTodoItem(todoId: string, updateTodoRequest: UpdateTodoRequest, userId: string): Promise<TodoUpdate> {
    logger.info(`Udating todo ${todoId} of user ${userId}`);

    return await todosAccess.updateTodoItem({
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    },
        todoId,
        userId);
}

export async function deleteTodoItem(todoId: string, userId: string) {
    await todosAccess.deleteTodoItem(todoId, userId)
  }