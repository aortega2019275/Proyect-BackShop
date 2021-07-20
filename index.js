'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;
var adminInit = require('./controllers/user.controller');
var defaultCInit = require('./controllers/category.controller');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/TiendaOnline2019275', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Conectado a la DB');
    adminInit.createInit();
    defaultCInit.CatcreateInit();
    app.listen(port, ()=>{
        console.log('Servicio de express en el puerto', port)
    })
})
.catch((err)=>{
    console.log('Error al conectar con la BD', err)
})