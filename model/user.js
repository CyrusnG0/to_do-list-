const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true,
        Lowercase:true
    },
    password:{
        type: String,
        required:true,
        length:6
    },

})

const user = mongoose.model('user',userschema);
module.exports = user;