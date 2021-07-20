'use strict'

var User = require('../models/user.model');
var Shoppingcart = require('../models/shoppingcart.model');
var Product = require('../models/product.model');
var Invoice = require('../models/invoice.model');
const { populate } = require('../models/user.model');

function setProduct(req, res){ 
    var userId = req.params.id;
    var params = req.body;
    var shoppingcart = new Shoppingcart();
    
    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al guardar'});
            }else if(userFind){
                Product.findOne({name: params.nameProd}, (err, productFind)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general'});
                    }else if(productFind){
                        var stock = productFind.stock;
                        var cant = parseInt(params.quantity);
                        if(stock >= cant){
                            shoppingcart.nameProd = productFind.name
                            shoppingcart.productId = productFind.id;
                            shoppingcart.quantity = params.quantity;
    
                            shoppingcart.save((err, shoppingcartSaved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al guardar'});
                                }else if(shoppingcartSaved){
                                    User.findByIdAndUpdate(userId, {$push:{shoppingcarts: shoppingcartSaved._id}}, {new: true}, (err, pushProduct)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general al setear producto'});
                                        }else if(pushProduct){
                                            return res.send({message: 'Contacto creado y agregado', pushProduct});
                                        }else{
                                            return res.status(404).send({message: 'No se seteo el contacto, pero sí se creó en la BD'});
                                        }
                                    }).populate('shoppingcarts')
                                }else{
                                    return res.status(404).send({message: 'No se pudo guardar el producto'});
                                }
                            })
                        }else{
                            return res.status(404).send({message: 'no hay stock'});
                        }

                    }else{
                        return res.status(404).send({message: 'no se encontro el producto'});
                    }
                })
            }else{
                return res.status(404).send({message: 'No se pudo guardar el contacto'});
            }
        })
    }
}

function purchase (req, res){
    var userId = req.params.id;
    var addFact = new Invoice();

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(userFind){
                addFact.users = userFind;
                Shoppingcart.find({_id: userFind.shoppingcarts}).exec((err, shoppingcartFind)=>{
                    if(err){
                        return res.status(500).send({message: 'Error en el servidor'});
                    }else if(shoppingcartFind){
                        addFact.shoppingcarts = shoppingcartFind;
                        Shoppingcart.findOne({_id: userFind.shoppingcarts}).exec((err, shoppingcartPunsh)=>{
                            if(err){
                                return res.status(500).send({message: 'Error en el servidor'});
                            }else if(shoppingcartPunsh){
                               //return res.send({shoppingcartPunsh});
                                var idpro = shoppingcartPunsh.productId;
                                var cuantity = shoppingcartPunsh.quantity;
                                Product.findOne({_id: idpro}).exec((err, countStock)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al setear producto'});
                                    }else if(countStock){
                                        var stock = countStock.stock;
                                        var subtotal = countStock.price;
                                        var CountV = parseInt(countStock.best);
                                        var CountVT = CountV+1;
                                        if( cuantity <= stock){
                                            var newStock = stock-cuantity;
                                            addFact.totalPay = subtotal*cuantity;
                                            Product.updateMany({_id: idpro},{$set: {stock: newStock, best: CountVT}}, (err, productsFind)=>{
                                                if(err){
                                                    return res.status(500).send({message: 'Error en el servidor'});
                                                }else if(productsFind){
                                                    addFact.save((err, invoiceSaved)=>{
                                                        if(err){
                                                        }else if(invoiceSaved){
                                                            Shoppingcart.deleteMany((err, elimitedProduct)=>{
                                                                if(err){
                                                                    return res.status(500).send({message: 'Error general'})
                                                                }else if(elimitedProduct){
                                                                    return res.send({message: 'Factura Guardada', invoiceSaved})
                                                                }else{
                                                                    return res.status(404).send({message: 'Usuario no encontrado o ya eliminado'})
                                                                }
                                                            })
                                                        }else{
                                                            return res.status(404).send({message: 'nose guardo la factuer'})
                                                        }
                                                    })
                                                }else{
                                                    return res.status(404).send({message: 'no existe esta categoria'});
                                                }
                                            }).populate('category')
                                        }else{
                                            return res.send({message: 'no puedes hacer esta compra',cuantity, stock})
                                        }
                                    }else{
                                        return res.status(404).send({message: 'nose encontro'});
                                    }
                                })
                            }else{
                                return res.status(200).send({message: 'No hay registros'});
                            }
                        })
                    }else{

                    }
                })
            }else{
                return res.status(404).send({message: 'No se pudo guardar el contacto'});
            }
        })
    }


}

function getInvoice(req, res){
    Invoice.find({}).populate('shoppingcarts').exec((err, FactFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(FactFind){
            return res.send({message: 'Facturas de todos los usuarios', FactFind});
        }else{
            return res.status(404).send({message: 'No se puede encontrar facturas'});
        }
    })
}


module.exports = {
    setProduct,
    purchase,
    getInvoice
}