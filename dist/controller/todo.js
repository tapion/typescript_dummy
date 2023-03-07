"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const todo_1 = require("../model/todo");
const Todos = [];
const handler = (req, res, next) => {
    const text = req.body.text;
    const newTodo = new todo_1.Todo(Math.random().toString(), text);
    Todos.push(newTodo);
    res.json({ todos: Todos });
};
exports.handler = handler;
