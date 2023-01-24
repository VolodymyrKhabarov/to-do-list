const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");

fs.openSync("db.json", "w");
fs.writeFileSync("db.json", JSON.stringify([]));

app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
    res.json({ msg: "Hi to my first server" });
});

let id = 1;

app.get('/todo' , (req , res)=>{
    let rawdata = fs.readFileSync("db.json");
    let data = JSON.parse(rawdata);
    res.send(data);
});

app.post("/todo", (req, res) => {
    const { title, body, completed } = req.body;
    let rawdata = fs.readFileSync("db.json");
    let content = JSON.parse(rawdata);
    if (!title) {
        return res.status(400).json({ message: "No title in your request" });
    }

    if (!body) {
        return res.status(400).json({ message: "No body in your request" });
    }

    const todo = {
        id: id++,
        title,
        body,
        completed: completed || false,
    };

    const toWrite = [...content, todo];

    fs.writeFileSync("db.json", JSON.stringify(toWrite), (err) => {
        if (err) {
            console.error(err);
        }
    });
    res.status(201).json(todo);
});

app.delete("/todo/:id", (req, res) => {
    const { id } = req.params;
    let rawdata = fs.readFileSync("db.json", "utf8");
    let content = JSON.parse(rawdata);
    if (!content.find((i) => i.id == id)) {
        return res.status(404).json({ message: "Todo with that id not found" });
    } else {
        const toWrite = content.filter((i) => i.id != id);

        fs.writeFileSync("db.json", JSON.stringify(toWrite), (err) => {
            if (err) {
                console.error(err);
            }
        });
        res.status(202).json({ message: "Successfully deleted" });
    }
});

app.patch("/todo/:id", (req, res) => {
    console.log('req', req)
    console.log("req.params --->", req.params);
    const { id } = req.params;

    let rawdata = fs.readFileSync("db.json", "utf8");
    console.log("rawdata --->", rawdata);

    let content = JSON.parse(rawdata);
    console.log("content --->", content);

    if (!content.find((i) => i.id == id)) {
        return res.status(404).json({ message: "Todo with that id not found" });
    } else {
        const newTodo = req.body;
        console.log("newTodo1 --->", newTodo);
        const toWrite = content.map((i) => {
            if (i.id == id) {
                console.log("newTodo2 --->", newTodo);
                newTodo['id'] = parseInt(id);
                newTodo['title'] = i.title;
                newTodo['body'] = i.body;
                return newTodo;
            }
            console.log("i --->", i);
            return i;
        });
        console.log("toWrite --->", toWrite);
        fs.writeFileSync("db.json", JSON.stringify(toWrite), (err) => {
            if (err) {
                console.error(err);
            }
        });
        res.status(202).json(newTodo);
    }
});

app.listen(8080, function () {
    console.log("Listening on port 8080");
});
