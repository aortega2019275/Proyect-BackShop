'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = Schema({
    name: String,
    description: String
})

module.exports = mongoose.model('category', categorySchema);