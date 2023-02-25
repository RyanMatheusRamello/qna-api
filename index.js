const express = require("express");
const Client = require("./lib/client");
const app = express();
const setence = require("./lib/setence");


const client = new Client();

app.get("/", async (req, res) => {

    res.send(client);

});


app.get("/setence", async (req, res) => {

    if(req.query.q){

        const r = setence(req.query.q)

        return res.send({
            query: req.query.q,
            response: r
        })
    }
    res.send({});

});

app.get("/aswner", async (req, res) => {

    if(req.query.q){

        const r = await client.question(req.query.q)

        return res.send({
            query: req.query.q,
            message: await client.question(req.query.q),
            response: r.points >= 80 ? r.text : "Não sei como posso te responder essa pergunta"
        })
    }
    res.send([]);

});

app.listen(3500, () => {
    console.log("Server Running")
}); 