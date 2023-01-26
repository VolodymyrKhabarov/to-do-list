const submit = document.getElementById("submit");

submit.addEventListener("click", function (event) {
    event.preventDefault()
});

submit.addEventListener("click", function () {
    const todo = {
        title: document.getElementById("title").value,
        body: document.getElementById("body").value,
        completed: document.getElementById("completed").checked
    };
    if (todo.title == "") {
        todo.title = "Todo"
    }
    if (todo.body == "") {
        return alert("Description is required")
    }
    postTodo(todo);
    document.getElementById("form").reset();
});

function createItems(id, title, body, completed) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.dataset.id = id;

    const titleH3 = document.createElement("h3");
    titleH3.innerText = title;
    titleH3.classList.add("title");
    todoDiv.appendChild(titleH3);

    const bodyDiv = document.createElement("div");
    bodyDiv.innerText = body;
    bodyDiv.classList.add("body");
    todoDiv.appendChild(bodyDiv);

    const completedDiv = document.createElement("div");
    completedDiv.classList.add("completed");
    todoDiv.appendChild(completedDiv);

    const form = document.createElement("form");
    form.setAttribute('action', '#');
    completedDiv.appendChild(form);

    const label = document.createElement("label");
    label.innerText = "Is completed?";
    form.appendChild(label);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.setAttribute('id', 'completed_2');
    checkBox.setAttribute('name', 'completed_2');
    checkBox.checked = completed;
    label.after(checkBox);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.innerText = "X";
    todoDiv.appendChild(deleteBtn);

    content = document.getElementById("content");
    content.appendChild(todoDiv);

    deleteBtn.addEventListener("click", function () {
        deleteTodo(id);
    });

    const checkbox = document.querySelector(`[data-id="${id}"]` + ' input[type="checkbox"]');
    checkbox.addEventListener("click", function () {
        editCheckbox(id);
    });
}

async function postTodo(todo) {
    try {
        const response = await fetch('http://localhost:8080/todo', {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
        });
        if (response.ok) {
            const todo = await response.json();
            createItems(todo.id, todo.title, todo.body, todo.completed);
        }
    } catch (err) {
        alert(err);
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch('http://localhost:8080/todo/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
        });
        if (response.ok) {
            document.querySelector(`[data-id="${id}"]`).remove();
        }
    } catch (err) {
        alert(err);
    }
}

async function editCheckbox(id) {
    try {
        checkbox = {
            completed: document.querySelector(`[data-id="${id}"]` + ' input[type="checkbox"]').checked
        }
        await fetch('http://localhost:8080/todo/' + id, {
            method: 'PATCH',
            body: JSON.stringify(checkbox),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
    } catch (err) {
        alert(err);
    }
}

async function getTodo() {
    try {
        const response = await fetch('http://localhost:8080/todo')
        if (response.ok) {
            const content = await response.json()

            content.forEach(todo => {
                createItems(todo.id, todo.title, todo.body, todo.completed);
            });
        }
    } catch (err) {
        alert(err);
    }
}

getTodo()
