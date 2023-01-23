const express = require('express');
const route = express.Router();
const controller = require("../controller/user-controller");

route.get('/',controller.getAllUser);
route.post('/signup',controller.signUp);
route.post('/login',controller.logIn);


module.exports = route