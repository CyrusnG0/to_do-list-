const jwt = require('jsonwebtoken');
const User = require('../model/user')

const checkUser = async (req,res,next)=>{
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, 'zeta secret', async (err, decodedToken)=>{
            if(err){
                res.redirect('/login')
            }
            else{
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    }
    else{
        res.redirect('/login')
    }
}

module.exports = {checkUser}