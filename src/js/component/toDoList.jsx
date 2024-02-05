import React, { useEffect, useState } from "react";

const ToDoList = () => {

    const [user, setUser] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const loadTasks = async () => {
        try {
            const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/sesmodev');
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error(error)
        }
    };


    const updateTask = async (value) => {
        try {
            const newTask = {
                label: value,
                done: false,
            }
            const updatedListTask = [...tasks, newTask]
            const putOptions = {
                method: 'PUT',
                body: JSON.stringify(updatedListTask),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const putResponse = await fetch('https://playground.4geeks.com/apis/fake/todos/user/sesmodev', putOptions);
            if (putResponse.ok) {
                setInputValue("");
                loadTasks();
            }
            else { console.log("ERROR al agregar la tarea") }
        } catch (error) {
            console.log(error);
        }
    };


    const deleteTask = async (id) => {
        const updatedList = tasks.filter((task) => task.id !== id);
        if (updatedList.length === 0) {
            const defaultTask = {
                id: 1,
                label: "Tarea por defecto",
                done: false
            }
            updatedList.push(defaultTask);
        }
        try {
            const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/sesmodev',
                {
                    method: 'PUT',
                    body: JSON.stringify(updatedList),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            if (response.ok) {
                loadTasks();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const createUser = async () => {
        const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/sesmodev',
        {
            method: 'POST',
            body: JSON.stringify([]),
            headers: {
                "Content-Type": "application/json"
            }
        }
        ).then(response => console.log(response.ok));
        return response;
    };

    const handleOnCreateUser = () => {
        createUser();
    };


    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            updateTask(inputValue);
            setTasks([...tasks, inputValue])
            setInputValue("");
        }
    }

    useEffect(() => {
        loadTasks()
    }, [])

    const handleDeleteTask = async (index) => {
        await deleteTask(index);
        setTasks(tasks.filter((_, currentIndex) => index !== currentIndex));
    }



    return (
        <div className="text-center">
            <h1>Sesmodev ToDoList</h1>
            <button onClick={() => handleOnCreateUser()}>Crear usuario</button>

            <div>
                <input type="text" onChange={(e) => setInputValue(e.target.value)} value={inputValue} onKeyDown={handleKeyDown}
                    placeholder="Añadir tarea"></input>
            </div>
            <ul>
                {tasks.map((t, index) => {
                    return (
                        <li key={index}>
                            {`${t.label}`}
                            <i class="fa-regular fa-trash-can" onClick={() => handleDeleteTask(t.id)}></i>
                        </li>
                    )
                })}
            </ul>

            <div>Actualmente hay {tasks.length} en la lista.</div>
        </div>
    );

}

export default ToDoList;