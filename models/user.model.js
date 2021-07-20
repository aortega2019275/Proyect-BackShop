'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    username: String,
    name: String,
    lastname: String,
    password: String,
    email: String,
    role: String,
    
    shoppingcarts: [{type: Schema.ObjectId, ref:'shoppingcart'}]
})

module.exports = mongoose.model('user', userSchema);