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
                if(user){
                    req.userInfo= {user}
                    res.locals.user = user
                    next()
                }else{
                    res.cookie('jwt', '', {maxAge:1})
                    res.redirect('/login')
                }
            }
        })
    }
    else{
        res.redirect('/login')
    }
}

module.exports = {checkUser}