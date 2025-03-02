const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { contains } = require('validator');

const userschema = new mongoose.Schema({
    username:{
        type: String,
        required:[true, 'pls enter a username'],
        unique:true,
        Lowercase:true,
        minlength:[6, 'username must be at least 6 characters'],
        validate:{
            validator: function(v){
                const regrex = /(?=.*[A-Z])/;
                return regrex.test(v);
            },
            message:"username must contain at least one uppercase letter"
        }
    },
    password:{
        type: String,
        required:true,
        minlength:[6, 'password must be at least 6 characters']
    },

})

userschema.pre("save",async function(next){
    console.log('user about to be created:', this);
})

userschema.post('save',async function(doc){
    console.log('new user created:', doc);
})

const user = mongoose.model('user',userschema);
module.exports = user;