'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shoppingcartSchema = Schema({
  //  UserId: [{type: Schema.ObjectId, ref: 'user'}],
    productId: String,
    nameProd : String,
    quantity: Number,
    //productId: [{type: Schema.ObjectId, ref:'product'}],
})

module.exports = mongoose.model('shoppingcart', shoppingcartSchema);