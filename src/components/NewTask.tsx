import React, { useRef } from "react";

interface INewTask{
    onAddTodo: (text: string) => void;
}

const NewTask: React.FC<INewTask> = props => {
    const textRef = useRef<HTMLInputElement>(null);

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        props.onAddTodo(textRef.current!.value);
        textRef.current!.value = '';
    }

    return <form onSubmit={submitHandler}>
        <div>
            <label htmlFor="text-task">New Task</label>
            <input type="text" id="text-task" ref={textRef} />
            <button type="submit">Add</button>
        </div>
    </form>
}

export default NewTask;