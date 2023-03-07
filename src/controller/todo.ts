import { RequestHandler } from 'express';
import { Todo } from '../model/todo'

const Todos: Todo[] = [];

export const handler: RequestHandler = (req, res, next) => {
    const text = req.body.text;
    const newTodo = new Todo(Math.random().toString(), text)
    Todos.push(newTodo);
    res.json({ todos: Todos})
}