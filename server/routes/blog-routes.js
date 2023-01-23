const express = require('express');
const blogRoute = express.Router();
const controller = require("../controller/blog-controller");

blogRoute.get('/',controller.getAllBlogs);
blogRoute.post('/add',controller.addBlog);
blogRoute.put('/update/:id',controller.updateBlog);
blogRoute.get('/:id',controller.getBlogById);
blogRoute.delete('/delete/:id',controller.deleteBlog);
blogRoute.get('/user/:id',controller.getByUserId);




module.exports = blogRoute