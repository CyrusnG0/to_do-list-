const mongoose = require('mongoose');
const { all } = require('../route/authRoute');


const listschema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    all_list: {
        type: [{ // Add type definition here
          title: {
            type: String,
            required: true,
            unique: false,
            indexedDB:false,

          },
          content: [String]
        }],
        required: false, // Move required outside the array definition
        unique: false,
        indexedDB:false
      }

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
    const target ={userId:userId, "all_list.title":title}
    const isExist = await this.find({userId:userId, all_list:{$elemMatch:{title:title}}})
    if(isExist.length!=0){
        console.log(isExist)
        const result = await this.findOneAndUpdate(target, {$push:{'all_list.$.content':content}});
        return result
    }throw Error('no such type exist')
}

listschema.statics.deleteSubType = async function(userId, title, content){
    const target = {user:userId, "all_list.title":title}
    const isExist = await this.find({userId:userId, all_list:{$elemMatch:{title:title}}})
    if(isExist.length!=0){
        
    }else{
        throw Error(title + 'no such type exist')
    }
}


const list = mongoose.model('list',listschema);
module.exports = list;

