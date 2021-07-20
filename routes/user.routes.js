'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var shoppingcartController = require('../controllers/shoppingcart.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();


api.post('/login', userController.login);
api.post('/registerUser', userController.registerUser);
api.post('/saveUser', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.saveUser);
api.put('/editRol/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.editRol);
api.put('/updateUser/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthClient], userController.updateUser);
api.delete('/removeUser/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthClient], userController.removeUser);
api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getUsers);

api.post('/addProduct/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], shoppingcartController.setProduct);
api.post('/purchase/:id', mdAuth.ensureAuth, shoppingcartController.purchase);



module.exports = api;