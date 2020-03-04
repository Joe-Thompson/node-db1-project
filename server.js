const express = require('express');
const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get("/", async (req, res, next) => {
   try {
       const accounts = await db.select("*").from("accounts");
       res.status(200).json(accounts)
   } catch (e) {
       next(e)
   }
});

server.get("/:id",  async (req, res, next) => {
    try {
        const accounts = await db.select("*").from("accounts").where({ id: req.params.id });
        res.status(200).json(accounts)
    } catch (e) {
        next(e)
    }
});

server.post("/", async (req, res, next) => {
    try {
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        };
        const [id] = await db("accounts").insert(payload);
        const newAccount = await db("accounts").where("id", id).first();
        res.status(201).json(newAccount)
    } catch (e) {
        next(e)
    }
});

server.put("/:id", async (req, res, next) => {
    try {
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        };
        await db("accounts").where({ id: req.params.id }).update(payload);
        const updateAcc = await db("accounts").where({ id: req.params.id }).first();
        res.status(200).json(payload);
    } catch (e) {
        next(e)
    }
});

server.delete("/:id", async (req, res, next) => {
    try {
        const accRemove = await db("accounts").where({ id: req.params.id }).del();
        res.status(204).json(accRemove)
    } catch (e) {
        next(e)
    }
});

module.exports = server;
