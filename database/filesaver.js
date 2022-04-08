const db = require('../config/connection')
const collection = require('../config/collection')

module.exports={
    //saving user details to db
    saveUser:(user)=>{
        db.get().collection(collection.USER_COLLECTION).createIndex({userId:"text"})
        db.get().collection(collection.USER_COLLECTION).insertOne(user).then((res)=>{
            console.log('User save');
        })
    },

    //check user
    checkUser:(query)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.USER_COLLECTION).findOne({chatId:query.chatId,userId:query.userId}).then((res)=>{
                //console.log(res);
                if(res){
                    resolve(true)
                }else{
                    resolve(false)
                }
            })
        })
    },
    getUser:(query)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.USER_COLLECTION).findOne({chatId:query.chatId,userId:query.userId}).then((res1)=>{
                resolve(res1)
            })
        })
    },

    //update user
    updateUser:(user)=>{
        db.get().collection(collection.USER_COLLECTION).replaceOne({chatId:user.chatId,userId:user.userId},user).then((res)=>{
            console.log('User update success');
        })
    },

    //Info user
    geInfo:(geInfo)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.USER_COLLECTION).findOne({chatId:geInfo.chatId,userId:geInfo.userId}).then((res1)=>{
                resolve(res1)
            })
        })
    },

    getUser2:(chatUser)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.USER_COLLECTION).find({chatId:chatUser.chatId}).toArray().then((res)=>{
                resolve(res);
                
            })
        })
    },

    revokeUser:(chatRes)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({chatId:chatRes.chatId,userId:chatRes.userId},{$set: {post: 0, type: ""}}).then((res)=>{
            console.log('User update success');
        })
    },

    delUser:(chatDel)=>{
        db.get().collection(collection.USER_COLLECTION).deleteOne({chatId:chatDel.chatId,userId:chatDel.userId}).then((res)=>{
            console.log('Inactive user done');
        })
    }
}
