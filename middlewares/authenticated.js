'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'encriptacionVentas-Online-IN6BV@';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene cabecera de autenticación'});
    }else{
        var token = req.headers.authorization.replace(/['"']+/g, '');
        try{
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token expirado'});
            }
        }catch(err){
            return res.status(404).send({message: 'Token inválido'})
        }

        req.user = payload;
        next();
    }
}

exports.ensureAuthAdmin = (req, res, next)=>{
    var payload = req.user;

    if(payload.role != "ROLE_ADMIN"){
        return res.status(404).send({message: 'No tienes permiso para acceder a esta ruta'});
    }else{
        return next();
    }
}

exports.ensureAuthClient = (req, res, next)=>{
    var payload = req.user;

    if(payload.role != "ROLE_CLIENT"){
        return res.status(404).send({message: 'Solo el cliente tiene permiso para realizar esta acción'});
    }else{
        return next();
    }
}