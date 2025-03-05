const mongoose = require('mongoose');

const listschema = new mongoose.Schema({
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


const user = mongoose.model('list',listschema);
module.exports = user;