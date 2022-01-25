const path = require('path');
const User = require('../models/user');
const validateUserInput = require('../validation/checkUserInput');
const validateLoginInput = require('../validation/checkLoginInput');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { renameSync } = require('fs');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const secret = process.env.JWT_SECRET

const register = async (req, res) => {
    const {errors, isValid} = validateUserInput(req.body)
    // check all fields
    if(!isValid) {
        return res.status(400).json(errors)
    }
    // check if email is already existing
    const user = await User.findOne({email: req.body.email});
    if(user){
        errors.email = "Email is already taken."
        return res.status(200).json(errors)
    } 

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8)
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            apartment: req.body.apartment,
            street: req.body.street,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        })

        await newUser.save();
        res.status(200).json({success:true})


    } catch(err) {
        res.status(500).json({
            success: false,
            message:"Cannot create user right now."
        })
    }
};

const login = async (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors)
    }

    try{
        // check email if already exist.
        const user = await User.findOne({email:req.body.email})
        if(!user){
            errors.email  = "User not found"
            return res.status(404).json(errors)
        }

        
        const comparePass = await bcrypt.compare(req.body.password, user.password)
        if(!comparePass){
            errors.password = "Password not match.";
            return res.status(400).json(errors)
        }

        // setup jwt
        const token = await jwt.sign({
            userId: user._id,
            isAdmin: user.isAdmin
        }, secret, {expiresIn: 3600})

       
        res.status(200).json({
            user:user.email,
            token: token
        });

    }catch(err) {
        res.status(500).json({
            success: false,
            message:"Can't login"
        })
    }
}

const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('name phone email country isAdmin');
    try{
        if(!users) {
            return res.status(404).json({
                success: false,
                message: 'No users found'
            });
        }

        res.status(200).json(users)
    } catch(e) {
        res.status(500).json("Can't make request")
    }
}


const updateUser = async (req, res) => {
    //Update user without password;
    const existingUser = await User.findById(req.params.id);
    let newPassword;
    try{
        if(req.body.password) {
            newPassword = await bcrypt.hash(req.body.password, 8);
        } else {
            newPassword = existingUser.password;
        }

        const updatedUser = {
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            street: req.body.street,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        }
        const user = await User.findByIdAndUpdate({_id:req.params.id}, updatedUser, {returnOriginal:false});
        if(!user){
            return res.status(404).json({
                success: false,
                message:"User not found"
            });
        }

        // then save
        await user.save();
        res.status(200).json({success:true, message:"User updated successfully!"});
    }catch(err){
        res.status(400).json({
            success: false,
            message: "Can't update user data."
        })
    }
}


const countUser = async (req, res) => {
    try {
       const users = await User.countDocuments();
       if(!users) {
           return res.status(404).json({message: "No users"})
       }

       res.status(200).json({
           userCount:users
       })

   }catch(err) {
       res.status(500).json({
           success: false,
           message: "Can't count users'"
       })
   }

   
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) {
            return res.status(404).json({message: "User not found"})
        }

        res.status(200).json({success: true, message: "User deleted successfully"})
    } catch (err) {
        res.status(500).json(`Can't delete user`)
    }
}

const getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user)
    }catch(err) {
        res.status(500).json("Can't find user")
    }
}

module.exports = {
    register,
    login, 
    getAllUsers, 
    updateUser, 
    countUser,
    deleteUser,
    getSingleUser
}