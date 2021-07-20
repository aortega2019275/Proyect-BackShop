'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invoiceSchema = Schema({
    users: [{type: Schema.ObjectId, ref:'user'}],
    shoppingcarts: [{type: Schema.ObjectId, ref:'shoppingcart'}],
    totalPay: Number
})

module.exports = mongoose.model('invoice', invoiceSchema);