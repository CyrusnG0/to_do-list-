const exp = require('constants');
const User = require('../model/user');
const express = require('express')

const getError = (err)=>{
    let errors={username:'', password:''}

    if(err.code==11000){
        errors.username = 'that username is already registered'
        return errors
    }

    Object.values(err.errors).forEach((error)=>{
        errors[error.properties.path]=error.properties.message;
    })
    return errors
}


module.exports.signup_post = async (req,res)=>{
   try{
    const user =  await User.create(req.body)
   }catch(err){
         const errors = getError(err)
         console.log(errors)
         res.status(400).json({errors})

   }
}


module.exports.signup_get =  (req,res)=>{
    res.render('signup');
}