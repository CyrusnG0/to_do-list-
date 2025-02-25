const exp = require('constants');
const User = require('../model/user');
const express = require('express')


module.exports.signup_post = async (req,res)=>{
   try{
    const user =  await User.create(req.body)
   }catch(err){
       console.log(err);
   }
}


module.exports.signup_get =  (req,res)=>{
    res.render('signup');
}