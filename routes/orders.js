const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()


const {
    createOrder,
    getOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder, 
    countOrders,
    totalSales,
    userOrders
} = require('../controllers/orders')

// @route    post /orders
// @desc     create order
// @access   Private
router.post('/orders', jsonParser, createOrder);

// @route    get /orders/:id
// @desc     get order by ID
// @access   Private
router.get('/orders/:id', getSingleOrder), 

// @route    get /orders
// @desc     get orders
// @access   Private
router.get('/orders', getOrders)

// @route    put /order/:id
// @desc     update status of order
// @access   Private
router.put('/orders/:id', updateOrder)

// @route    delete /order/:id
// @desc     delete order
// @access   Private
router.delete('/orders/:id', deleteOrder)

// @route    get /order/get/count
// @desc     count orders
// @access   Private
router.get('/orders/get/count', countOrders)


// @route    get /order/get/totalsales
// @desc     get total sales
// @access   Private
router.get('/orders/get/totalsales', totalSales)


// @route    /order/userorders/:userid
// @desc     get usersorder
// @access   Private
router.get('/order/userorders/:userid', userOrders)


module.exports = router;