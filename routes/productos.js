const { Router } = require("express");
const contenedor = require("../contenedor");
const moment = require('moment');
const router = Router();

const productos = new contenedor("productos.txt");
const admin = true;

function serverProductsRoutes(app) {
    app.use("/api/productos", router);
    // this.ok
    router.get('/:id?', (req, res) => {
        const {id} = req.params;
        if (id) {
            const object = productos.getById(id);
            object.then(response => {
                if (response) {
                    res.json({
                        admin,
                        product: response
                    });
                } else {
                    res.send("Producto no encontrado");
                }
            }).catch(err => console.log("Error en router.get()", err));
        } else {
            const allProducts = productos.getAll();
            allProducts.then(response => {
                res.json({
                    admin,
                    products: response
                });
            }).catch(err => console.log("Error en router.get()", err));

        }
    })

    // this is ok
    router.post('/', (req, res) => {
        if (admin) {
            const timestamp = moment().format('DD/MM/YYYY hh:mm:ss a');
            const product = {timestamp, ...req.body};
            const savedProduct = productos.save(product);
            savedProduct.then(response => res.json(response)).catch(err => console.log("Error en router.post()", err));
        } else {
            res.send("Solo disponible para administradores");
        }
    })

    router.put('/:id', (req, res) => {
        if (admin) {
            const {id} = req.params;
            const product = req.body;
            const updatedProduct = productos.updateById(id, product);
            updatedProduct.then(response => {
                if (response) {
                    res.json(response);
                } else {
                    res.send("Producto no encontrado");
                }
            }).catch(err => console.log("Error en router.put()", err));
        } else {
            res.send("Solo disponible para administradores");
        }
    })

    //this ok
    router.delete('/:id', (req, res) => {
        if (admin) {
            const {id} = req.params;
            const deleteProduct = productos.deleteById(id);
            deleteProduct.then(response => {
                if (response) {
                    res.json(response);
                } else {
                    res.send("Producto no encontrado");
                }
            }).catch(err => console.log("Error en router.get()", err));
        } else {
            res.send("Solo disponible para administradores");
        }
    })
}

module.exports = serverProductsRoutes;