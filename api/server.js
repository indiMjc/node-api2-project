const express = require("express");

// const postRouter = require("../data/db");

const server = express();

server.get("/", (req, res) => {
  res.send(`
    <h2>API up and running<h2>
    `);
});

// server.use("/api/posts", postRouter);

module.exports = server;
