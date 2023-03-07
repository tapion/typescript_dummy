"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todo_1 = require("../controller/todo");
const routes = (0, express_1.default)();
routes.post('/', todo_1.handler);
routes.get('/');
routes.patch('/:id');
routes.delete('/:id');
exports.default = routes;
