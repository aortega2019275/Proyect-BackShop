
'use strict'

const { update } = require('../models/category.model');
var Category = require('../models/category.model');
var Product = require('../models/product.model');

function CatcreateInit(req, res){
    let category = new Category();
    category.name = 'default'
    category.description = 'categoria por default'

    Category.findOne({name: category.name}, (err, defaultFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(defaultFind){
            return console.log('categoria por defalut ya creada')
        }else{
        
            category.name = category.name;
            category.description = category.description;
            category.save((err, categoryDeSaved)=>{
                if(err){
                    return res.status(500).send({message: 'Error general cat default'})
                }else if(categoryDeSaved){
                    return console.log('categoria inicial creada correctamente')
                }else{
                    return res.status(500).send({message: 'categoria defaul no guardada'})
                }
            })           
        }
    })
}


function saveCategory(req, res){
    var category = new Category();
    var params = req.body;

    if(params.name){
        Category.findOne({name: params.name},(err, categoryFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(categoryFind){
                return res.send({message: 'Categoria ya creada anteriormente'})
            }else{
                category.name = params.name.toLowerCase();
                category.description = params.description;
                category.save((err, categorySaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general'})
                    }else if(categorySaved){
                        return res.send({message: 'categoria creada', categorySaved})
                    }else{
                        return res.status(500).send({message: 'categoria no guardada'})
                    }
                })
            }
        })
    }else{
        return res.status(401).send({message: 'Por favor llena los campos requeridos'})
    }
}

function updateCategory(req, res){
    let categoryId = req.params.id;
    let params = req.body;

    if(params.name){
        Category.findOne({name: params.name}, (err, categoryFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(categoryFind){
                return res.send({message: 'Esta categoría ya fue creada'});
            }else{
                Category.findByIdAndUpdate(categoryId, params, {new:true}, (err, categoryUpdate)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al actualizar'})
                    }else if(categoryUpdate){
                        return res.send({message: 'Categoría actualizada', categoryUpdate})
                    }else{
                        return res.status(401).send({message: 'No se actualizó la categoría'})  
                    }
                })
            }
        })
    }else {
        Category.findByIdAndUpdate(categoryId, params, {new:true}, (err, categoryUpdate)=>{
            if(err){
                return res.status(500).send({message: 'Error general al actualizar'})
            }else if(categoryUpdate){
                return res.send({message: 'Categoría actualizada', categoryUpdate})
            }else{
                return res.status(401).send({message: 'No se actualizó la categoría'})  
            }
        })
    }   
}

function removeCategory(req, res){
    let categoryId = req.params.id;

    Category.findOne({name : 'default'}, (err, categoriaDfl)=>{
        if(err){
            return res.status(500).send({message: 'Error en el servidor'});
        }else if(categoriaDfl){
            Product.updateMany({category: categoryId},{$set: {category: categoriaDfl.id}}, (err, productsFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error en el servidor'});
                }else if(productsFind){
                    Category.findByIdAndDelete(categoryId, (err, categoryDeleted)=>{
                        if(err){
                            return res.status(500).send({message: 'Error en el servidor'});
                        }else if(categoryDeleted){
                            return res.send({message: 'categoria eliminada', categoryDeleted})
                        }else{
                            return res.status(404).send({message: 'no existe esta categoria'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'no existe esta categoria'});
                }
            }).populate('category')
        }else{
            return res.status(404).send({message: 'no se encontro la categoria por default'});
        }
    })
}

function getCategories(req, res){
    Category.find({}).exec((err, Categories)=>{
        if(err){
            return res.status(500).send({message: 'Error en el servidor'});
        }else if(Categories){
            return res.send({message: 'Productos encontrados:', Categories});
        }else{
            return res.status(200).send({message: 'No hay registros'});
        }
    })
}


module.exports = {
    CatcreateInit,
    saveCategory,
    updateCategory,
    removeCategory,
    getCategories
}