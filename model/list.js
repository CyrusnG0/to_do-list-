const mongoose = require('mongoose');
const { all } = require('../route/authRoute');

const contentSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:[String]
})

const listschema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    all_list:[contentSchema]

})

listschema.post('save',async function(doc){
    console.log('new list created:', doc);
})
//define two fucntions, one for adding the main type from contentSchema to the all_list of list schema and the other for adding the sub type in contentSchema
listschema.statics.addnewType = async function(userId, title){
    const newType = {title:title, content:[]}
    const isExist = await this.find({userId:userId, all_list:{$elemMatch:{title:title}}})
    if(isExist.length==0){
        const result = await this.findOneAndUpdate({userId:userId}, {$push:{all_list:newType}});
        return result
    }else{
        throw Error(title + ' type already exist')
    }
    
}

listschema.statics.addnewSubType = async function(userId, title, content){
    // const target ={userId:userId, "all_list.title":title}
    // const isExist = await this.find("all_list.title"=title)
    // if(isExist){
    //     const result = await this.findOneAndUpdate(target, {$push:{'all_list.$.content':content}});
    //     return result
    // }throw Error('no such type exist')
}


const list = mongoose.model('list',listschema);
module.exports = list;

