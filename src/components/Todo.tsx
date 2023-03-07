import React from "react";

interface TodosProps {
    items: {id: string, text:string}[],
    onDeleteTodo: (id: string) => void
}

const TodoList: React.FC<TodosProps> = props => {
    console.log('In propos ',props.items)
    return <ul>
        {props.items.map(td => <li key={td.id}><span>{td.text}</span><button onClick={props.onDeleteTodo.bind(null,td.id)} >Delete</button></li>)}
    </ul>
}

export default TodoList;