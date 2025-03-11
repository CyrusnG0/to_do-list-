const jwt = require('jsonwebtoken');
const List = require('../model/list')

const returnData = async (current_id)=>{
    let result = []
    const list = await List.find({userId:current_id})
    Object.values(list[0].all_list).forEach((item)=>{
        result.push(item.title)
    })
    return result
}

module.exports.main_logout_get = (req,res)=>{
    res.cookie('jwt', '', {maxAge:1})
    res.redirect('/home')
}

module.exports.main_get = async (req,res)=>{
    const token = req.cookies.jwt
    const current_id = req.userInfo.user._id.toString()
    res.locals.main_types = await returnData(current_id)
    res.locals.sub_types = []
    res.locals.title = ""
    res.render('main');

    

}

module.exports.main_post = async (req,res)=>{
    const type = req.body.type
    const input = req.body.input
    const token = req.cookies.jwt
    const current_id = req.userInfo.user._id.toString()

    try{
        if(type=="main"){
            try{
                await List.addnewType(current_id, input).catch(err=>console.log(err))//catch error also
                res.json({input})
            }catch(err){
                res.status(200).json({err})
            }
        }else{
            if(type=="sub"){
                const title = req.body.title
                List.addnewSubType(current_id, title, input).catch(err=>console.log(err))//???????
                res.status(200).json({input})

            }
        }
    }catch(err){
        console.log(err)
    }
}

module.exports.main_id_get = async (req,res)=>{
    const title = req.params.id
    const token = req.cookies.jwt
    const current_id = req.userInfo.user._id.toString()
    const main_types = await returnData(current_id)
    if(main_types.includes(title)){
        const list = await List.findOne({userId:current_id, "all_list.title":title})
        const result = list.all_list.filter((item)=>item.title==title)
        res.locals.title = title
        res.locals.main_types = main_types
        res.locals.sub_types = result[0].content

        res.render('main');
    }else{
        res.render('404')
        
    }

}

module.exports.main_id_delete = async (req,res)=>{//rmb to tackle where after delete the user can't add any sub type in this empty and tell the user to create a new main type first
    const id = req.params.id
    const {type, data} = req.body
    console.log(req.body)
    const token = req.cookies.jwt
    const current_id = req.userInfo.user._id.toString()
    if(type=="sub"){
        List.deleteSubType(current_id, id, data).catch(err=>console.log(err))
    }
}
