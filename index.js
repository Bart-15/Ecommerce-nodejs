const express = require('express');
const app = express();
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')


// Router
const productRouter  = require('./routes/products');
const categoryRouter = require('./routes/categories');
const orderRouter = require('./routes/orders');
const userRouter = require('./routes/users');
require('dotenv').config({ path: './.env' })
const api = process.env.API_URL


const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'))

// router
app.use(authJwt())
app.use(errorHandler)
app.use('/public/uploads', express.static(path.join(__dirname, '/public/uploads')))
app.use(cors());
app.use(`${api}`,  userRouter);
app.use(`${api}`, productRouter);
app.use(`${api}`, categoryRouter);
app.use(`${api}`, orderRouter);





app.listen(PORT, () => {
    console.log('listening on port '+ PORT)
})