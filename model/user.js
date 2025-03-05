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

userschema.statics.login = async function(username, password){
    const user = await this.findOne({username});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }else{
            throw Error('validation failed');
        }
        
    }else{
        throw Error('validation failed');
    }
    
}

userschema.pre("save",async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
})

userschema.post('save',async function(doc){
    console.log('new user created:', doc);
})

const user = mongoose.model('user',userschema);
module.exports = user;