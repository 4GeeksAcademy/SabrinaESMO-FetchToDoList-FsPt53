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
        if (tasks.length === 1) {
            alert("La lista no puede quedar vacía. Debes tener al menos una tarea.");
            return;
        }
    
        const updatedList = tasks.filter((task) => task.id !== id);
        
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
        <div className="contentBox text-center w-75 mx-auto p-2 mt-5">
            <h1 className="text-center mt-1 ">Tareas pendientes de Sesmodev</h1>
            <button className="createUserButton" onClick={() => handleOnCreateUser()}><i className="fa-solid fa-user-plus">&emsp;</i>Crear usuario</button>
            <div>
            <br></br>
                <input type="text" onChange={(e) => setInputValue(e.target.value)} value={inputValue} onKeyDown={handleKeyDown}
                    placeholder="Añadir tarea"></input>
            </div>
            <ul className="listContainer mt-3 w-75 mx-auto p-2">
                {tasks.map((t, index) => {
                    return (
                        <li key={index} className="itemContainer mb-2 text-start position-relative">
                            <i>&emsp;</i>
                            {`${t.label}`}
                            <button className="deleteButton position-absolute end-0" onClick={() => handleDeleteTask(t.id)}><i className="trashCan fa-regular fa-trash-can"></i></button>
                        </li>
                    )
                })}
            </ul>
            <div>Actualmente hay {tasks.length} por finalizar.</div>
        </div>
    );

}

export default ToDoList;