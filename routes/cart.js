const { Router } = require("express");
const contenedor = require("../contenedor");
const moment = require('moment');
const router = Router();

const productos = new contenedor("productos.txt");
const cart = new contenedor("cart.txt");
const admin = true;

function serverCartRoutes(app) {
    app.use("/api/cart", router);

    // this.ok
    router.post('/', (req, res) => {
        const timestamp = moment().format('DD/MM/YYYY hh:mm:ss a');
        const product = {
            timestamp,
            products: []
        };
        const savedProduct = cart.save(product);
        savedProduct.then(response => res.json(response)).catch(err => console.log("Error router.post()*cart", err));
    })

    //This.ok
    router.delete('/:id', (req, res) => {
        const {id} = req.params;
        const product = cart.deleteById(id);
        product.then(response => {
            if (response) {
                res.json(response);
            } else {
                res.send("Producto no encontrado");
            }
        }).catch(err => console.log("Error router.delete()*cart", err));
    })
    
    // it is ok
    router.get('/:id/productos', (req, res) => {
        const {id} = req.params;
        const product = cart.getById(id);
        product.then(response => {
            if (response) {
                res.json({
                    products: response.products
                });
            } else {
                res.send("Producto no encontrado");
            }
        }).catch(err => console.log("Error router.get()*cart", err));
    })

    // it is ok
    router.post('/:id/productos', (req, res) => {
        const {id} = req.params; //id carrito
        const {idProduct} = req.body; //id product
        const product = productos.getById(idProduct);
        product.then(productResponse => {
            if (productResponse) {
                const productCart = cart.getById(id);
                productCart.then(cartResponse => {
                    if (cartResponse) {
                        const updatedProductCart = cartResponse;
                        updatedProductCart.products.push(productResponse);
                        cart.updateById(id, updatedProductCart).then(updatedResponse => res.json(updatedResponse)).catch(err => console.log("Error router.post2()*cart", err)); //Acomodar este quilombo
                    } else {
                        res.send("Producto no encontrado");
                    }
                }).catch(err => console.log("Error router.post2()*cart", err));
            } else {
                res.send("Producto no encontrado");
            }
        }).catch(err => console.log("Error router.post2()*cart", err));
    })

    // Elimina el productos y el carrito no
    // IT is ok
    router.delete('/:id/productos/:id_prod', (req, res) => {
        const {id, id_prod} = req.params;
        const productId = cart.getById(id);
        productId.then(cartRes => {
            if (cartRes) {
                const cartProduct = cartRes;
                const productIndex = cartProduct.products.findIndex(e => e.id == id_prod);
                if (productIndex >= 0) {
                    cartProduct.products.splice(productIndex, 1);
                    cart.updateById(id, cartProduct).then(updatedRes => res.json(updatedRes)).catch(err => console.log("Error router.delete()*cart", err));
                } else {
                    res.send("Producto no encontrado");
                }
            } else {
                res.send("Producto no encontrado");
            }
        }).catch(err => console.log("Error router.delete()*cart", err));
    })

}

module.exports = serverCartRoutes;