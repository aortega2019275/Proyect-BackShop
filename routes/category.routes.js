'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var categoryController = require('../controllers/category.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveCategory', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], categoryController.saveCategory);
api.put('/updateCategory/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], categoryController.updateCategory);
api.delete('/removeCategory/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], categoryController.removeCategory);
api.get('/getCategories', mdAuth.ensureAuth, categoryController.getCategories);


module.exports = api;