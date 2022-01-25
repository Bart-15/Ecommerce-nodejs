const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('../database')

const CategoriesSchema = new Schema({
    name: {
        type:String,
        required: true,
    },
    icon: {
        type:String,
    },
    color: {
        type:String,
    }
});


const Category = mongoose.model('categories', CategoriesSchema);
module.exports = Category;