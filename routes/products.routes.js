'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var categoryController = require('../controllers/category.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();


api.post('/saveProduct', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], productController.saveProduct);
api.put('/updateProduct/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], productController.updateProduct);
api.put('/modStock/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], productController.addStock);
api.delete('/removeProduct/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], productController.removeProduct);
api.get('/controlStock/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], productController.controlStock);
api.get('/getProduct/:id', mdAuth.ensureAuth, productController.getProduct);
api.get('/getProducts', mdAuth.ensureAuth, productController.getProducts);
api.get('/outofStock', mdAuth.ensureAuth, productController.outofStokProduct); 
api.get('/searchProduct', mdAuth.ensureAuth, productController.searchProduct);
api.get('/SearchCategotyProd', mdAuth.ensureAuth, productController.SearchCategotyProd);
api.get('/bestProducts', mdAuth.ensureAuth, productController.bestProducts);


module.exports = api;