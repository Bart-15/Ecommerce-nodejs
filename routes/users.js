const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getAllUsers,
    updateUser, 
    countUser,
    deleteUser,
    getSingleUser
} = require('../controllers/users')


// @route    post /register
// @desc     create user
// @access   Public
router.post('/register', register);

// @route    post /login
// @desc     login user
// @access   Public
router.post('/login', login);

// @route    post /users
// @desc     get all users
// @access   Private
router.get('/users', getAllUsers);


// @route    post /users
// @desc     get all users
// @access   Private
router.put('/users/:id', updateUser);


// @route    post /users
// @desc     get all users
// @access   Private
router.get('/users/get/count', countUser);



// @route    delete /user/:id
// @desc     delete user by ID
// @access   Private
router.delete('/users/:id', deleteUser);


// @route    get /user/:id
// @desc     get single user
// @access   Private
router.get('/users/:id', getSingleUser);
module.exports = router;