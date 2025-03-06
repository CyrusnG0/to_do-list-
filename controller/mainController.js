const jwt = require('jsonwebtoken');
const List = require('../model/list')

module.exports.main_get = async (req,res)=>{
    res.render('main');
    const token = req.cookies.jwt
    const current_id = req.userInfo.user._id.toString()
    const list = await List.find({userId:current_id})

}

module.exports.main_post = async (req,res)=>{
    const type = req.body.type
    const input = req.body.input
    const token = req.cookies.jwt
    const current_id = req.userInfo.user._id.toString()
    try{
        if(type=="main"){
            List.addnewType(current_id, input)
            .catch((err)=>{console.log(err)})
        }else{
            if(type=="sub"){
                List.addnewSubType(current_id, req.body.title, input)
            }
        }
    }catch(err){
        console.log(err)
    }
}
