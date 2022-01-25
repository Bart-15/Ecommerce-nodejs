const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser')

const {
    createCategory,
    getCategories,
    deleteCategory,
    categoryDetails,
    updateCategory
}  = require('../controllers/categories')

// @route    post /categories
// @desc     create category
// @access   Private
router.post('/categories', createCategory)

// @route    get /categories
// @desc     get all categories
// @access   PRivate                    
router.get('/categories', getCategories)


// @route    delete /categories
// @desc     delete caetgory by ID
// @access   Private
router.delete('/categories/:id', deleteCategory)


// @route    get /categories
// @desc     get caetgory by ID
// @access   Private
router.get('/categories/:id', categoryDetails)

// @route    delete /categories
// @desc     delete caetgory by ID
// @access   Private
router.put('/categories/:id', updateCategory)


module.exports = router;