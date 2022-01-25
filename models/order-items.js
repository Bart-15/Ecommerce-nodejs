const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const OrderItemSchema = new Schema({
    quantity : {
        type:Number,
        required:true
    },
    product : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    }
})

const OrderItem = mongoose.model('orderitem', OrderItemSchema);

module.exports = OrderItem;