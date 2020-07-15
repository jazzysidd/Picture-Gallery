const Router = require('express').Router();


Router.use([require('./auth'),require('./postRoute'),require("./user")]);



module.exports = Router;