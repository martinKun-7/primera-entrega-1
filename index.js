const express = require('express');
const cors = require('cors');
const serverProductsRoutes = require('./routes/productos');
const serverCartRoutes = require('./routes/cart');

const app = express();
const PORT = 8092;



app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use('',express.static(__dirname + '/public'));

serverProductsRoutes(app);
serverCartRoutes(app);


app.listen(PORT, () => {
    console.log(`Estamos conectados a la URL http://localhost:${PORT}`)
})
app.on("Error",err => console.log(`Falló la conexión al servidor`,err));