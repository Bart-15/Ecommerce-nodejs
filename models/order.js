const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('../database')

const OrderSchema = new Schema({
    orderItems : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orderitem',
        required:true
    }],
    shippingAddress1 : {
        type:String,
        required:true
    },
    shippingAddress2 : {
        type:String,
    },
    city : {
        type:String,
        required:true
    },
    zip : {
        type:String,
        required:true
    },
    country : {
        type:String,
        required:true
    }, 
    phone : {
        type:String,
        required:true
    },
    status : {
        type:String,
        required:true,
        default:'0'
    },
    totalPrice : {
        type:Number
    },
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    dateOrdered : {
        type:Date,
        default: Date.now
    }
})

const Order = mongoose.model('orders', OrderSchema);
module.exports = Order;