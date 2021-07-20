'use strict'

var express = require('express');
var shoppingController = require('../controllers/shoppingcart.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/getInvoice', shoppingController.getInvoice);

module.exports = api;