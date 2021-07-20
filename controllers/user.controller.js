'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function createInit(req, res){
    let user = new User();
    user.username = 'admin'
    user.password = '12345'

    User.findOne({username: user.username}, (err, userFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(userFind){
            return console.log('Usuario admin ya fue creado')
        }else{
            bcrypt.hash(user.password, null, null, (err, passwordHash)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al comparar contraseña'})
                }else if(passwordHash){
                    user.password = passwordHash;
                    user.username = user.username;
                    user.role = 'ROLE_ADMIN';

                    user.save((err, userSaved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al guardar Usuario admin'})
                        }else if(userSaved){
                            return console.log('Usuario admin creado satisfactoriamente')
                        }else{
                            return res.status(500).send({message: 'Usuario admin no fue guardado'})
                        }
                    })
                }else{
                    return res.status(403).send({message: 'Contraseña no logro encriptarse'})
                }
            })
        }
    })
}

function login(req, res){
    var params = req.body;

    if(params.username && params.password){
        User.findOne({username: params.username}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al comparar contraseñas'});
                    }else if(checkPassword){
                        if(params.gettoken){
                            res.send({
                                token: jwt.createToken(userFind)
                            })
                        }else{
                            return res.send({message: 'Usuario logeado'});
                        }
                    }else{
                        return res.status(403).send({message: 'Usuario o contraseña incorrectos'});
                    }
                })
            }else{
                return res.status(404).send({message: 'Cuenta de usuario no encontrada'});
            }
        })
    }else{
        return res.status(404).send({message: 'Por favor envía los campos obligatorios'});
    }
}
function saveUser(req, res){
    var user = new User();
    var params = req.body;
    
    if(params.name && params.lastname && params.username && params.password && params.email  && params.role){
        User.findOne({username: params.username}, {email: params.email}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(userFind){
                return res.send({message: 'Nombre de usuario o email ya en uso'})
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al comparar contraseñas'})
                    }else if(passwordHash){
                        if(params.role == 'ROLE_ADMIN' || params.role == 'ROLE_CLIENT'){
                            user.password = passwordHash;
                            user.name = params.name;
                            user.lastname = params.lastname;
                            user.username = params.username;
                            user.email = params.email.toLowerCase();
                            user.role = params.role;
                            user.save((err, userSaved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al guardar usuario'})
                                }else if(userSaved){
                                    return res.send({message: 'Usuario creado satisfactoriamente', userSaved})
                                }else{
                                    return res.status(500).send({message: 'Usuario no guardado'})
                                }
                        })
                        }else{
                            return res.status(404).send({message:'agregue un rol valido'});
                        }
                    }else{
                        return res.status(403).send({message: 'Contraseña no logro encriptarse'})
                    }
                })
            }
        })
    }else{
        return res.status(401).send({message: 'Por favor llena los campos requeridos'})
    }
}

function editRol(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(update.username || update.email || update.lastname || update.password || update.name){
        return res.status(404).send({message:'Solo tienes permiso para cambiar el rol, intentelo de nuevo'});
    }else if(update.role){
        if(update.role == 'ROLE_ADMIN' || update.role == 'ROLE_CLIENT'){
            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al actualizar'});
                }else if(userUpdated){
                    return res.send({message: 'Usuario actualizado', userUpdated});
                }else{
                    return res.status(401).send({message: 'No se actualizó el usuario'});
                }
            })
        }else{
            return res.status(404).send({message:'agregue un rol valido'});
        }
    }else{
        return res.status(404).send({message:'Coloque el campo rol'});
    }
}

function registerUser(req, res){
    var user = new User();
    var params = req.body;
    if(params.name && params.lastname && params.username && params.password && params.email){
        User.findOne({username: params.username}, {email: params.email}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(userFind){
                return res.send({message: 'Nombre de usuario o email ya en uso'})
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al comparar contraseñas'})
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username;
                        user.email = params.email.toLowerCase();
                        user.role = 'ROLE_CLIENT';
                        user.save((err, userSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al guardar usuario'})
                            }else if(userSaved){
                                return res.send({message: 'Usuario creado satisfactoriamente', userSaved})
                            }else{
                                return res.status(500).send({message: 'Usuario no guardado'})
                            }
                        })
                    }else{
                        return res.status(403).send({message: 'Contraseña no logro encriptarse'})
                    }
                })
            }
        })
    }else{
        return res.status(401).send({message: 'Por favor llena los campos requeridos'})
    }
}

function updateUser(req ,res){
    let userId = req.params.id;
    let update = req.body;
    if(userId != req.user.sub){
        return res.status(404).send({message: 'Solo el usuario logeado puede editar su perfil'})
    }else{
        if(update.password){
            return res.status(403).send({message: 'No puedes actualizar la contraseña desde esta función'})
        }else if(update.role){
            return res.status(403).send({message: 'No puedes actualizar el Rol desde esta función'})
        }else{
            if(update.username){
                User.findOne({username: update.username}, (err, usernameFind)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general en la busqueda'})
                    }else if(usernameFind){
                        return res.send({message: 'Nombre de usuario ya en uso'})
                    }else{
                        User.findOne({email: update.email}, (err, emailFind)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general'})
                            }else if(emailFind){
                                return res.send({message: 'Correo ya en uso o agregue uno nuevo'})
                            }else{
                                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al actualizar'})
                                    }else if(userUpdated){
                                        return res.send({message: 'Usuario actualizado', userUpdated})
                                    }else{
                                        return res.status(401).send({message: 'No se actualizó el usuario'})  
                                    }
                                })
                            }
                        })
                    }
                })
            }else{
                User.findOne({email: update.email}, (err, emailFind)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general'})
                    }else if(emailFind){
                        return res.send({message: 'Correo ya en uso'})
                    }else{
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al actualizar'})
                            }else if(userUpdated){
                                return res.send({message: 'Usuario actualizado', userUpdated})
                            }else{
                                return res.status(401).send({message: 'No se actualizó el usuario'})  
                            }
                        })
                    }
                })
            }
        }
    }
}

function removeUser(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(!params.password){
        return res.status(401).send({message: 'Por favor ingresa la contraseña para poder eliminar tu cuenta'});
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al validar la contraseña'})
                    }else if(checkPassword){
                        User.findByIdAndRemove(userId, (err, userFind)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al validar el usuario'})
                            }else if(userFind){
                                return res.send({message: 'Usuario eliminado', userFind})
                            }else{
                                return res.status(404).send({message: 'Cliente no encontrado o ya eliminado'})
                            }
                        })
                    }else{
                        return res.status(403).send({message: 'Contraseña incorrecta'})
                    }
                })
            }else{
                return res.status(404).send({message: 'Usuario inexistente o ya eliminado'})
            }
        })
    }
}

function getUsers(req, res){

    User.find({}).populate('shoppingcarts').exec((err, users)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(users){
            return res.send({message: 'Usuarios encontrados', users});
        }else{
            return res.status(404).send({message: 'No hay registro de usuarios'});
        }
    })
}

module.exports = {
    createInit,
    login,
    saveUser, 
    editRol,
    updateUser,
    removeUser,
    registerUser,
    getUsers
}