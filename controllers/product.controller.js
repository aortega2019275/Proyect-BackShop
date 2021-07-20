'use strict'

var Product = require('../models/product.model');
var Category = require('../models/category.model');
var jwt = require('../services/jwt');
const { removeUser } = require('./user.controller');

function saveProduct(req, res){
    var product = new Product();
    var params = req.body;

    if(params.name && params.price){
        Product.findOne({name: params.name}, (err, productFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general1'})
            }else if(productFind){
                return res.send({message: 'Producto ya registrado intentelo de nuevo'});
            }else{
                if(params.category){
                    Category.findOne({name: params.category}, (err, categoryFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general2'})   
                        }else if(categoryFind){
                            if(params.stock){
                                product.name = params.name;
                                product.price = params.price;
                                product.stock = params.stock;
                                product.category = categoryFind.id;
                                product.best = 0;
                                product.save((err, productSaved)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general3'})
                                    }else if (productSaved){
                                        return res.send({message: 'Producto añadido satisfactoriamente', productSaved})
                                    }else{
                                        return res.status(500).send({message: 'Producto no añadido'})
                                    }
                                })
                            }else{
                                product.name = params.name;
                                product.price = params.price;
                                product.stock = 0;
                                product.category = categoryFind.id;
                                product.best = 0;
                                product.save((err, productSaved)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general4'})
                                    }else if (productSaved){
                                        return res.send({message: 'Producto añadido satisfactoriamente', productSaved})
                                    }else{
                                        return res.status(500).send({message: 'Producto no añadido'})
                                    }
                                })
                            }
                        }else{
                            Category.find((err, categoryFindT)=>{
                                return res.status(404).send({message: 'Categoria no encontrada Listado de Categorias disponibles', categoryFindT})
                            })
                            
                        }
                    })
                }else{
                    var categoryD = 'default';
                    Category.findOne({name: categoryD}, (err, categoryFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general8'})
                        }else if(categoryFind){
                            if(params.stock){
                                product.name = params.name;
                                product.price = params.price;
                                product.stock = params.stock;
                                product.category = categoryFind.id;
                                product.best = 0;
                                product.save((err, productSaved)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general5'})
                                    }else if (productSaved){
                                        return res.send({message: 'Producto añadido satisfactoriamente', productSaved})
                                    }else{
                                        return res.status(500).send({message: 'Producto no añadido'})
                                    }
                                })
                            }else{
                                product.name = params.name;
                                product.price = params.price;
                                product.stock = 0;
                                product.category = categoryFind.id;
                                product.best = 0;
                                product.save((err, productSaved)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general6'})
                                    }else if (productSaved){
                                        return res.send({message: 'Producto añadido satisfactoriamente', productSaved})
                                    }else{
                                        return res.status(500).send({message: 'Producto no añadido'})
                                    }
                                })
                            }
                        }else{
                            return res.status(404).send({message: 'Categoria no encontrada Listado de Categorias disponibles'})
                        }
                    })
                    
                }
            }
        })
    }else{
        return res.status(401).send({message: 'Por favor llena los campos requeridos'})
    }
}

function getProducts(req, res){
    Product.find({}).populate('category').exec((err, products)=>{
        if(err){
            return res.status(500).send({message: 'Error en el servidor'});
        }else if(products){
            return res.send({message: 'Productos encontrados:', products});
        }else{
            return res.status(200).send({message: 'No hay registros'});
        }
    })
}

function getProduct(req, res){
    let productId = req.params.id;

    Product.findById(productId).populate('category').exec((err, product)=>{
        if(err){
            return res.status(500).send({message: 'Error en el servidor'});
        }else if(product){
            return res.status(200).send({message: 'Usuario encontrado', product})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}

function updateProduct(req, res){
    let productId = req.params.id;
    let update =req.body;

    if(update.name || update.stock || update.price || update.category){
        if(update.category){
            Category.findOne({name: update.category}, (err, categoryFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error en el servidor'});
                }else if(categoryFind){
                    update.category = categoryFind.id;

                    Product.findOne({name: update.name}, (err, nameFind)=>{
                        if(err){
                            res.status(500).send({message: 'Error en el servidor'})
                        }else if(nameFind){
                            res.status(200).send({message: 'Nombre de usario ya en uso, no se puede actualizar'})
                        }else{
                            Product.findByIdAndUpdate(productId, update, {new: true}, (err, productUpdate)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general'});
                                }else if(productUpdate){
                                    return res.send({message: 'Productos actualizado', productUpdate});
                                }else{
                                    return res.status(404).send({message: 'No hay registro para actualizar'}); 
                                }
                            }).populate('category')
                        }
                    })
                }else{
                    Category.find((err, categoryFindT)=>{
                        return res.status(404).send({message: 'Categoria no encontrada Listado de Categorias disponibles', categoryFindT})
                    })
                }
            })
        }else{
            Product.findOne({name: update.name}, (err, nameFind)=>{
                if(err){
                    res.status(500).send({message: 'Error en el servidor'})
                }else if(nameFind){
                    res.status(200).send({message: 'Nombre de usario ya en uso, no se puede actualizar'})
                }else{
                    Product.findByIdAndUpdate(productId, update, {new: true}, (err, productUpdate)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(productUpdate){
                            return res.send({message: 'Productos actualizado', productUpdate});
                        }else{
                            return res.status(404).send({message: 'No hay registro para actualizar'}); 
                        }
                    }).populate('category')
                }
            })
        } 
    }else{
        return res.status(404).send({message: 'por favor ingresar un dato'});
    }
}

function removeProduct(req, res){
    let productId = req.params.id;

    Product.findByIdAndRemove(productId, (err, productRemoved)=>{
        if(err){
            return res.status(500).send({message: 'Error en el servidor'});
        }else if(productRemoved){
            return res.send({message: 'Producto eliminado', productRemoved});
        }else{
            return res.status(404).send({message: 'Producto no encontrado o anteriormente eliminado'});
        }
    })
}

function EditStock(req, res){
    let productId = req.params.id;
    let update =req.body;

    if(update.name || update.stock || update.price || update.category){
        if(update.category){
            Category.findOne({name: update.category}, (err, categoryFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error en el servidor'});
                }else if(categoryFind){
                    update.category = categoryFind.id;

                    Product.findOne({name: update.name}, (err, nameFind)=>{
                        if(err){
                            res.status(500).send({message: 'Error en el servidor'})
                        }else if(nameFind){
                            res.status(200).send({message: 'Nombre de usario ya en uso, no se puede actualizar'})
                        }else{
                            Product.findByIdAndUpdate(productId, update, {new: true}, (err, productUpdate)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general'});
                                }else if(productUpdate){
                                    return res.send({message: 'Productos actualizado', productUpdate});
                                }else{
                                    return res.status(404).send({message: 'No hay registro para actualizar'}); 
                                }
                            }).populate('category')
                        }
                    })
                }else{
                    Category.find((err, categoryFindT)=>{
                        return res.status(404).send({message: 'Categoria no encontrada Listado de Categorias disponibles', categoryFindT})
                    })
                }
            })
        }else{
            Product.findOne({name: update.name}, (err, nameFind)=>{
                if(err){
                    res.status(500).send({message: 'Error en el servidor'})
                }else if(nameFind){
                    res.status(200).send({message: 'Nombre de usario ya en uso, no se puede actualizar'})
                }else{
                    Product.findByIdAndUpdate(productId, update, {new: true}, (err, productUpdate)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(productUpdate){
                            return res.send({message: 'Productos actualizado', productUpdate});
                        }else{
                            return res.status(404).send({message: 'No hay registro para actualizar'}); 
                        }
                    }).populate('category')
                }
            })
        } 
    }else{
        return res.status(404).send({message: 'por favor ingresar un dato'});
    }
}

function addStock(req, res){
    let productId = req.params.id;
    let params = req.body;

    if(params.name || params.price || params.category){
        return res.status(404).send({message:'No puedes actualizar esos campos en esta función'}); 
    }else if(params.stock){
        Product.findByIdAndUpdate(productId, params, {new:true}, (err, productUpdate)=>{
            if(err){
                return res.status(500).send({message: 'Error general en actualizar el stock'});
            }else if(productUpdate){
                return res.send({message: 'Stock actualizado', productUpdate});
            }else{
                return res.status(401).send({message: 'No se actualizó el stock'});
            } 
        })
    }else {
        return res.status(404).send({message:'Debe editar solo el campo stock'});
    }
}


function controlStock(req, res){
    Product.find({}, {name :1, stock: 1}).exec((err, products)=>{
        if(err){
            return res.status(500).send({message: 'Error en el servidor'});
        }else if(products){
            return res.send({message: 'Productos encontrados:', products});
        }else{
            return res.status(200).send({message: 'No hay registros'});
        }
    })
}

function outofStokProduct(req, res){
    Product.find({stock: 0}).exec((err, products)=>{
        if(err){
            return res.status(500).send({message: 'Error en el servidor'});
        }else if(products){
            return res.send({message: 'Productos encontrados:', products});
        }else{
            return res.status(200).send({message: 'No hay registros'});
        }
    })
}

function searchProduct(req, res){
    var params = req.body;

    if(params.search){
        Product.find({name: params.search}, (err, productFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(productFind){
                return res.send({message: 'Se encontraron estos productos: ', productFind});
            }else {
                return res.status(404).send({message: 'No hay productos con esa descripción'});
            }
        }).populate('category')
    }else {
        return res.status(404).send({message: 'agregar una busqueda'});
    }
}

function SearchCategotyProd(req, res){
    var params = req.body;
    if(params.category){
        Category.findOne({name: params.category}, (err, categoryFind)=>{
            if(err){
                return res.status(500).send({message: 'error general'})
            }else if(categoryFind){
                Product.find({category: categoryFind.id}, (err, productFind)=>{
                    if(err){
                        return res.status(500).send({message: 'error general'})
                    }else if(productFind){
                        return res.send({message: 'Productos: ',productFind})
                    }else{
                        return res.status(404).send({message: 'Productos no encontrados'})
                    }
                }).populate('category')
            }else{
                return res.status(404).send({message: 'categoria no encontrada'})
            }
        })
    }else{
        return res.status(404).send({message: 'ingrese un dato a buscar'})
    }
}

function bestProducts(req, res){
    Product.find({}).exec((err, products)=>{
        if(err){
            return res.status(500).send({message: 'Error en el servidor'});
        }else if(products){
            products.sort((a, b) => b.best - a.best)
            return res.send({message: 'Productos Mas Vendidos:',products});
        }else{
            return res.status(200).send({message: 'No hay registros'});
        }
    })
}


module.exports = {
    //crud
    saveProduct,
    updateProduct,
    removeProduct,
    addStock,
    getProducts,
    getProduct,
    controlStock,
    outofStokProduct,
    searchProduct,
    SearchCategotyProd,
    bestProducts
}