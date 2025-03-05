const exp = require('constants');
const User = require('../model/user');
const express = require('express')
const jwt = require('jsonwebtoken')

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

const genToken = (id)=>{
    return jwt.sign({id},'zeta secret',{expiresIn:3*24*60*60})
}


module.exports.signup_post = async (req,res)=>{
    const {username,password} = req.body
   try{
    const user =  await User.create({username,password})
    const token = genToken(user._id)
    res.cookie('jwt', token, {httpOnly:true, maxAge:3*24*60*60*1000})
    res.status(200).json({user:user._id})

   }catch(err){
         const errors = getError(err)
         res.status(400).json({errors})

   }
}

module.exports.login_post = async (req,res)=>{
    const {username,password} = req.body
    try{
        const user = await User.login(username,password)
        const token = genToken(user._id)
        res.cookie('jwt', token, {httpOnly:true, maxAge:3*24*60*60*1000})
        res.status(200).json({user:user._id})
    }
    catch(err){
        const error = {message: 'invalid username or password'}
        res.status(400).json({error})

    }
}

module.exports.login_get = async (req,res)=>{
    res.render('login');
 }


module.exports.signup_get =  (req,res)=>{
    res.render('signup');
}