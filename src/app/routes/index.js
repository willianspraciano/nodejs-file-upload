const routes = require("express").Router();

const postsRoutes = require("./posts.routes");

routes.use("/posts", postsRoutes);

module.exports = routes;
