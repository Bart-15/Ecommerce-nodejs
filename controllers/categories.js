const Category = require('../models/category')
const checkCategoriesInput = require('../validation/checkCategoriesInput')

const createCategory = async (req, res) => {
    const {errors, isValid} = checkCategoriesInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors) 
    }
    try{
        const newCategory = new Category({
            name : req.body.name,
            icon : req.body.icon,
            color: req.body.color
        });
        await newCategory.save();
        res.status(200).json({
            success: true,
            newCategory 
        });
    }catch(err){
        res.status(400).json({
            success: false,
            message:"Can't create category"
        });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        if(!categories){
            return res.status(404).json({success: false, message: "There is no category."});
        }
        res.status(200).json(categories);
    }catch(err){
        res.status(400).json({success: false, message:"Can't get categories."});
    }
}

const deleteCategory = async (req, res) => {
    try {
       const category = await Category.findByIdAndDelete(req.params.id);
        if(!category) {
            return res.status(404).json({success: false, message:"Category not found."});
        }
      res.json({success: true});        
   } catch(err){
       res.status(400).json({success: false, message:"Can't delete'"});
   }
}

const categoryDetails = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if(!category){
            res.status(404).json({success: false, message:"Category not found"});
        }
        res.status(200).json({success: true, category});
    }catch (e) {
        res.status(404).json({success: false, message:"Category not found"});
    }
}

const updateCategory = async (req, res) => {
    const {errors, isValid} = checkCategoriesInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors) 
    }
    const updatedCategories = {
        name : req.body.name,
        icon : req.body.icon,
        color: req.body.color
    }
    try {
        const category = await Category.findByIdAndUpdate({_id:req.params.id}, updatedCategories, {returnOriginal:false});
        if(!category) {
            res.status(404).json({success:false, message:"Category not found"});
        }

        await category.save();
        res.status(200).json(category);
    }catch(err) {
        res.status(404).json({message:"Category can't update"});
    }


    // res.json(category)
}
module.exports = {
    createCategory,
    getCategories,
    deleteCategory,
    categoryDetails,
    updateCategory  
}