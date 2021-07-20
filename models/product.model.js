'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    name: String,
    stock: Number,
    price: Number,
    best: Number,
 
    category: [{type: Schema.ObjectId, ref:'category'}]
})

module.exports = mongoose.model('product', productSchema);