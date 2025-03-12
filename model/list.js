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
    // console.log('new list created:', doc);

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
    const target = {userId:userId, all_list:{$elemMatch:{title:title}}}
    const isExist = await this.find({userId:userId, all_list:{$elemMatch:{title:title}}})


    if(isExist.length!=0){
        const arr = isExist[0].all_list.filter((item)=>item.title==title)[0].content
        arr.splice(arr.indexOf(content),1)
        const result = await this.updateOne({userId:userId},
            [
                {
                    $set:{
                        all_list:{
                            $map:{
                                input:"$all_list",
                                as:"item",
                                in:{
                                    $cond:{
                                        if:{$eq:["$$item.title", title]},
                                        then:{
                                            title: "$$item.title",
                                            content:arr
                                        },
                                        else:"$$item"
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        )
    }else{
        throw Error(title + 'no such type exist')
    }
}

listschema.statics.modSubType = async function(userId, title, content, newContent){
    const target = {userId:userId, all_list:{$elemMatch:{title:title}}}
    const isExist = await this.find({userId:userId, all_list:{$elemMatch:{title:title}}})


    if(isExist.length!=0){
        const arr = isExist[0].all_list.filter((item)=>item.title==title)[0].content
        console.log(arr.indexOf(content), content)
        arr[arr.indexOf(content)] = newContent
        const result = await this.updateOne({userId:userId},
            [
                {
                    $set:{
                        all_list:{
                            $map:{
                                input:"$all_list",
                                as:"item",
                                in:{
                                    $cond:{
                                        if:{$eq:["$$item.title", title]},
                                        then:{
                                            title: "$$item.title",
                                            content:arr
                                        },
                                        else:"$$item"
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        )
    }else{
        throw Error(title + 'no such type exist')
    }
}

listschema.statics.deleteMainType = async function(userId, title){
    const target = {userId:userId, all_list:{$elemMatch:{title:title}}}
    const isExist = await this.find({userId:userId, all_list:{$elemMatch:{title:title}}})

    if(isExist.length!=0){
        const result = await this.updateOne({userId:userId}, {$pull:{all_list:{title:title}}})
    }
    else{
        throw Error(title + 'no such type exist')
    }
}

listschema.statics.modMainType = async function(userId, title, newTitle){
    const target = {userId:userId, all_list:{$elemMatch:{title:title}}}
    const isExist = await this.find({userId:userId, all_list:{$elemMatch:{title:title}}})

    if(isExist.length!=0){
        const result = await this.updateOne({userId:userId},
            [
                {
                    $set:{
                        all_list:{
                            $map:{
                                input:"$all_list",
                                as:"item",
                                in:{
                                    $cond:{
                                        if:{$eq:["$$item.title", title]},
                                        then:{
                                            title: newTitle,
                                            content: "$$item.content"
                                        },
                                        else:"$$item"
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        )
    }else{
        throw Error(title + 'no such type exist')
    }
}




const list = mongoose.model('list',listschema);
module.exports = list;


