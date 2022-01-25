const express = require('express');
const router = express.Router();
const multer = require('multer');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
  };

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid image type");

        if(isValid) {
            error = null
        }

        cb(error, 'public/uploads')
    },
    filename : function(req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${ext}`)
    }
})

const uploadOptions = multer({storage: storage})

const {
    createProduct,
    getAllProducts, 
    productDetails,
    updateProduct,
    deleteProduct, 
    productCount,
    getFeatured, 
    galleryImages
} = require('../controllers/products')

// @route    post /products
// @desc     create product
// @access   Private
router.post('/products', uploadOptions.single('image'), createProduct);


// @route    get /products
// @desc     get all products
// @access   Public
router.get('/products',  getAllProducts);

// @route    get /products
// @desc     get product by ID
// @access   Public
router.get('/products/:id', productDetails);

// @route    put /products
// @desc     update product
// @access   Private
router.put('/products/:id', uploadOptions.single('image'), updateProduct);

// @route    delete /product
// @desc     delete product
// @access   Private
router.delete('/products/:id', deleteProduct);

// @route    get /product/get/count
// @desc     delete product
// @access   Private
router.get('/products/get/count', productCount);


// @route    get /product/get/featured/:count
// @desc     get all featured products
// @access   Private
router.get('/products/get/featured/:count', getFeatured);


// @route    get /galler-images/:id
// @desc     upload multiple images
// @access   Private
router.put('/products/gallery-images/:id', uploadOptions.array('images', 10), galleryImages);

module.exports = router;