// server için gerekli olanları burada ayarlayın

// posts router'ını buraya require edin ve bağlayın
const express = require("express");
const server = express();
const postRouter = require("./posts/posts-router");

server.use(express.json()); //Json istekleri karşılamak için

server.use("/api/posts", postRouter);

module.exports = server;
