const Product = require('../models/product')
const Category = require('../models/category')
const ObjectId = require('mongoose').Types.ObjectId;
const checkProductsInput = require('../validation/checkProductsInput')



const createProduct = async (req, res) => {
    // check the category id if existing
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).json("Category id not found.")
    }

    // check all required fields
    const {errors, isValid} = checkProductsInput(req.body)
    if(!isValid){
        return res.status(400).json(errors)
    }

    if(!req.file) {
        errors.image = "Image field is required."
        return res.status(400).json(errors)
    }

    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    try{
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        })
        
        await newProduct.save();
        res.status(200).json(newProduct);
    }catch(err) {
        res.status(500).json("Can't create product")
    }

}

const getAllProducts  = async (req, res) => {
    let filter = {};
    try{
        if(req.query.category){
            filter = { category: req.query.category.split(",")}
        }

        const products = await Product.find(filter).populate('category')
        if(!products) {
            return res.status(404).json("There is no product available right now.")
        }
        res.status(200).json(products)
        
    } catch(err) {
        res.status(500).json("Can't get all products")
    }
}

const productDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if(!product) {
            res.status(404).json("Can't find product")
        }

        res.status(200).json({
            success: true, 
            product
        })
    } catch(err) {
        res.status(500).send({
            success: false,
            message: "Can't get product details"
        })
    }
}


const updateProduct = async (req, res) => {
    // check all required fields
    const {errors, isValid} = checkProductsInput(req.body)
    if(!isValid){
        return res.status(400).json(errors)
    }
    // check the category id if existing
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).json("Category id not found.")
    }


    //update image optional
    let imagePath;
    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(404).json("Product not found")
    }

    
    if(req.file) {
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagePath = `${basePath}${fileName}`
    } else {
        imagePath = product.image
    }

    const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagePath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    }

    try {
        const product = await Product.findByIdAndUpdate({_id: req.params.id}, updatedProduct, {returnOriginal:false})
        if(!product){
          return res.status(404).json({
                success: false,
                message:"Product not found"
            })
        }

        await product.save();
        res.status(200).json(updatedProduct)

    }catch(err) {
        res.status(500).json({
            sucess:false,
            message:"Product can't update"
        })
    }


}

const deleteProduct = async (req, res) => {
    if(!ObjectId.isValid(req.params.id)){
        return res.status(404).send({
            succes:false,
            message:"Invalid product ID. "
        })
    }
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).send({succes:false,message:"Product not found"});
        res.status(200).send({
            succes:true,
            message:"Product deleted successfully!"
        })
    }catch(err) {
        res.status(500).json({
            succes:false,
            message:"Can't delete product."
        })
    }
}

const productCount = async (req, res) => {
    try{
        const product = await Product.countDocuments();
        if(!product) {
            return res.status(400).json({
                success: false
            })
        }
        
        res.status(200).json({
            success:true,
            productCount: product
        })

    } catch(err){
        res.status(500).json({
            success:false,
            message: "Can't get products"
        })
    }
}

const getFeatured = async (req, res) => {
    try{
        const count = req.params.count ? req.params.count : 0;

        const products = await Product.find({isFeatured: true}).limit(+count)
        if(!products) return res.status(404).json({sucess:false, message: 'Product not found'});

        res.status(200).json(products)

    }catch(err){
        res.status(500).json({succes:false, message:"Can't get featured products."})
    }
}

const galleryImages = async (req, res) => {
    if(!ObjectId.isValid(req.params.id)){
       return  res.status(400).json({message:"Invalid product id"})
    }
    try {
        const imagePaths = [];
        const files = req.files;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

        if(files) {
            files.map(file => {
                imagePaths.push(`${basePath}${file.filename}`)
            })
        }

        await Product.findByIdAndUpdate({_id: req.params.id}, {images:imagePaths}, {returnOriginal:false})
        res.status(200).json({success:true, message:"Images uploaded successfully."})
    } catch(err) {
        res.status(500).json({succes:false, message:"Can't upload multiple images."})
    }
}
module.exports = {
    createProduct,
    getAllProducts, 
    productDetails, 
    updateProduct,
    deleteProduct,
    productCount,
    getFeatured,
    galleryImages
}