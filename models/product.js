const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('../database')

const ProductSchema = new Schema({
    name : {
        type:String,
        required: true
    },
    description : {
        type:String,
        required: true
    },
    richDescription : {
        type:String,
        default:''
    },
    image : {
        type:String,
        default:''
    },
    images : [{
        type:String,
    }],
    brand : {
        type:String,
        default:''
    },
    price : {
        type:Number,
        default:0
    }, 
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required:true
    },
    countInStock : {
        type:Number,
        required:true,
        min:0,
        max:255
    }, 
    rating : {
        type:Number,
        default:0
    },
    numReviews : {
        type:Number,
        default:0
    },
    isFeatured : {
        type:Boolean,
        default:false
    }, 
    dateCreated : {
        type:Date,
        default: Date.now,
    }

})

ProductSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

ProductSchema.set('toJSON', {
    virtuals:true
})

const Product = mongoose.model('products', ProductSchema);
module.exports = Product;