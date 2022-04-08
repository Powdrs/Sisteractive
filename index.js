require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);

process.env.TZ = "Asia/Jakarta";

//database
const db = require('./config/connection');
const collection = require('./config/collection');
const saver = require('./database/filesaver');

//DATABASE CONNECTION 
db.connect((err) => {
    if(err) { console.log('error connection db' + err); }
    else { console.log('db connected'); }
})


function today(ctx){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    return today = mm + '/' + dd + '/' + yyyy + ' ' + hours + ':' + minutes + ':' + seconds;
}

//Function
function first_name(ctx){
    return `${ctx.from.first_name ? ctx.from.first_name : ""}`;
}
function last_name(ctx){
    return `${ctx.from.last_name ? ctx.from.last_name : ""}`;
}
function username(ctx){
    return ctx.from.username ? `@${ctx.from.username}` : "";
}

//BOT START
bot.start(async(ctx)=>{
    if(ctx.chat.type == 'private') {
        await ctx.deleteMessage(ctx.message.message_id)
        ctx.reply('test');
    }
})

//TEST BOT
bot.hears(/ping/i,async(ctx)=>{
    if(ctx.chat.type == 'private') {    
        await ctx.deleteMessage(ctx.message.message_id)
        let chatId = ctx.message.from.id;
        let opts = {
            reply_markup:{
                inline_keyboard: [[{text:'OK',callback_data:'PONG'}]]
            }
        }
        return await bot.telegram.sendMessage(chatId, 'pong' , opts);
    }
})

bot.action('PONG',async(ctx)=>{
    await ctx.deleteMessage(ctx.message.message_id)
})

//Info member
bot.command('info',async(ctx)=>{
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
        const memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)

        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')

        const query = {
           chatId: ctx.chat.id,
           userId: parseInt(text)
        }
        
        if(memberstatus.status == 'creator'){
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    await saver.checkUser(query).then(async res => {
                        if(res == true) {
                            const res1 = await saver.getUser(query)
                            const array1 = res1;
                            const name2 = array1.nameId ? `<a href="tg://user?id=${array1.userId}">${array1.nameId}</a>` : "-";
                            const username2 = array1.usenameId  ? array1.usenameId : "-";
                            const type = array1.type ? array1.type.slice(0,1).toUpperCase() + array1.type.substr(1) : "-";
                            await ctx.reply(`<b>User info</b> \n🆔 ID: <code>${array1.userId}</code> \n👱 Name: ${name2} \n🌐 Username: ${username2} \n💬 Message: ${array1.post} media \n💭 Last message type: ${type}`,{
                                parse_mode:'HTML'
                            })
                        }else{
                            await ctx.reply('User not found');
                        }
                    })
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                
                }
            }
        }else if(memberstatus.status == 'administrator'){
            if(memberstatus.can_restrict_members == true){
                if(botStatus.status == 'administrator'){
                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){ 
                        await saver.checkUser(query).then(async res => {
                            if(res == true) {
                                const res1 = await saver.getUser(query)
                                const array1 = res1;
                                const name2 = array1.nameId ? `<a href="tg://user?id=${array1.userId}">${array1.nameId}</a>` : "-";
                                const username2 = array1.usenameId  ? array1.usenameId : "-";
                                const type = array1.type ? array1.type.slice(0,1).toUpperCase() + array1.type.substr(1) : "-";
                                await ctx.reply(`<b>User info</b> \n🆔 ID: <code>${array1.userId}</code> \n👱 Name: ${name2} \n🌐 Username: ${username2} \n💬 Message: ${array1.post} media \n💭 Last message type: ${type}`,{
                                    parse_mode:'HTML'
                                })
                            }else{
                                await ctx.reply('User not found');
                            }
                        })
                    }
                }else{
                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    
                    }
                }
            }
        }
        if(ctx.from.username == 'GroupAnonymousBot'){
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    await saver.checkUser(query).then(async res => {
                        if(res == true) {
                            const res1 = await saver.getUser(query)
                            const array1 = res1;
                            const name2 = array1.nameId ? `<a href="tg://user?id=${array1.userId}">${array1.nameId}</a>` : "-";
                            const username2 = array1.usenameId  ? array1.usenameId : "-";
                            const type = array1.type ? array1.type.slice(0,1).toUpperCase() + array1.type.substr(1) : "-";
                            await ctx.reply(`<b>User info</b> \n🆔 ID: <code>${array1.userId}</code> \n👱 Name: ${name2} \n🌐 Username: ${username2} \n💬 Message: ${array1.post} media \n💭 Last message type: ${type}`,{
                                parse_mode:'HTML'
                            })
                        }else{
                            await ctx.reply('User not found');
                        }
                    })
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                
                }
            }
        }
    }
})

//New member
bot.on('new_chat_member', async(ctx) => {
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)

        const query = {
          chatId: ctx.message.chat.id,
          userId: ctx.message.new_chat_member.id
        }

        function first_name2(ctx){
            return `${ctx.message.new_chat_member.first_name ? ctx.message.new_chat_member.first_name : ""}`;
        }
        function last_name2(ctx){
            return `${ctx.message.new_chat_member.last_name ? ctx.message.new_chat_member.last_name : ""}`;
        }
        function username2(ctx){
            return ctx.message.new_chat_member.username ? `@${ctx.message.new_chat_member.username}` : "";
        }

        if(botStatus.status == 'administrator'){
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                await saver.checkUser(query).then(async res => {
                    if(res == true) {
                        const res1 = await saver.getUser(query)
                        const array1 = res1;
                        const user = {
                            chatId: ctx.message.chat.id,
                            userId: ctx.message.new_chat_member.id,
                            nameId: `${first_name2(ctx)} ${last_name2(ctx)}`,
                            usenameId: `${username2(ctx)}`,
                            post: array1.post + 1,
                            type: ''
                        }
                        await saver.updateUser(user)
                    }else{
                        const user = {
                            chatId: ctx.message.chat.id,
                            userId: ctx.message.new_chat_member.id,
                            nameId: `${first_name2(ctx)} ${last_name2(ctx)}`,
                            usenameId: `${username2(ctx)}`,
                            post: 0,
                            type: ''
                        }
                        await saver.saveUser(user)
                    }
                })
            }
        }else{
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                
            }
        }
    }
})

//Inactive
bot.command('inactive',async(ctx)=>{
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
        const memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)

        const msg = ctx.message.text
        let text = msg.split(' ')

        const chatUser = {
            chatId: ctx.chat.id,
        }

        const userDetails = await saver.getUser2(chatUser).then(async res =>{
            const n = res.length
            const chatId = []
            for (let i = n-1; i >=0; i--) {
                chatId.push({chatId: res[i].chatId, userId: res[i].userId, post: res[i].post});
            }
            
            async function inactive(text) {
                for (const chat of chatId) {
                    try {
                        if(memberstatus.status == 'creator'){
                            if(botStatus.status == 'administrator'){
                                const posted = chat.post;
                                if(posted <= 0){
                                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                        await bot.telegram.kickChatMember(ctx.chat.id, chat.userId).then(async result =>{
                                        })
                                        const chatDel = {
                                            chatId: chat.chatId,
                                            userId: chat.userId
                                        }
                                        await saver.delUser(chatDel)
                                    }
                                }else if(posted => 0){
                                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                        const chatRes = {
                                            chatId: chat.chatId,
                                            userId: chat.userId
                                        }
                                        await saver.revokeUser(chatRes)
                                    }
                                }
                            }else{
                                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                
                                }
                            }
                        }else if(memberstatus.status == 'administrator'){
                            if(memberstatus.can_restrict_members == true){
                                if(botStatus.status == 'administrator'){
                                    const posted = chat.post;
                                    if(posted <= 0){
                                        if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                            await bot.telegram.kickChatMember(ctx.chat.id, chat.userId).then(async result =>{
                                            })
                                            const chatDel = {
                                                chatId: chat.chatId,
                                                userId: chat.userId
                                            }
                                            await saver.delUser(chatDel)
                                        }
                                    }else if(posted => 0){
                                        if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                            const chatRes = {
                                                chatId: chat.chatId,
                                                userId: chat.userId
                                            }
                                            await saver.revokeUser(chatRes)
                                        }
                                    }
                                }else{
                                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                    
                                    }
                                }
                            }
                        }
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            if(botStatus.status == 'administrator'){
                                const posted = chat.post;
                                if(posted <= 0){
                                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                        await bot.telegram.kickChatMember(ctx.chat.id, chat.userId).then(async result =>{
                                        })
                                        const chatDel = {
                                            chatId: chat.chatId,
                                            userId: chat.userId
                                        }
                                        await saver.delUser(chatDel)
                                    }
                                }else if(posted => 0){
                                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                        const chatRes = {
                                            chatId: chat.chatId,
                                            userId: chat.userId
                                        }
                                        await saver.revokeUser(chatRes)
                                    }
                                }
                            }else{
                                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                
                                }
                            }
                        }
                    } catch (err) {

                    }
                }
                if(memberstatus.status == 'creator'){
                    ctx.reply(`✔️ Cleaning finished!`)
                }else if(memberstatus.status == 'administrator'){
                    if(memberstatus.can_restrict_members == true){
                        ctx.reply(`✔️ Cleaning finished!`)
                    }
                }else if(ctx.from.username == 'GroupAnonymousBot'){
                    ctx.reply(`✔️ Cleaning finished!`)
                }
            }

            await ctx.deleteMessage(ctx.message.message_id)
            inactive(text)
            if(memberstatus.status == 'creator'){
                ctx.reply(`🪣 Bot starts member cleanup`)
            }else if(memberstatus.status == 'administrator'){
                if(memberstatus.can_restrict_members == true){
                    ctx.reply(`🪣 Bot starts member cleanup`)
                }
            }else if(ctx.from.username == 'GroupAnonymousBot'){
                ctx.reply(`🪣 Bot starts member cleanup`)
            }
        })
    }
    
})

//Document files
bot.on('document', async(ctx) => {
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)

        const query = {
          chatId: ctx.chat.id,
          userId: ctx.from.id
        }

        if(botStatus.status == 'administrator'){
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                await saver.checkUser(query).then(async res => {
                    if(res == true) {
                        const res1 = await saver.getUser(query)
                        const array1 = res1;
                        const user = {
                            chatId: ctx.chat.id,
                            userId: ctx.from.id,
                            nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                            usenameId: `${username(ctx)}`,
                            post: array1.post + 1,
                            type: 'document'
                        }
                        await saver.updateUser(user)
                    }else{
                        const user = {
                            chatId: ctx.chat.id,
                            userId: ctx.from.id,
                            nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                            usenameId: `${username(ctx)}`,
                            post: 0,
                            type: 'document'
                        }
                        await saver.saveUser(user)
                    }
                })
            }
        }else{
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                
            }
        }
    }
})

//Video files
bot.on('video', async(ctx) => {
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)

        const query = {
          chatId: ctx.chat.id,
          userId: ctx.from.id
        }

        if(botStatus.status == 'administrator'){
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                await saver.checkUser(query).then(async res => {
                    if(res == true) {
                        const res1 = await saver.getUser(query)
                        const array1 = res1;
                        const user = {
                            chatId: ctx.chat.id,
                            userId: ctx.from.id,
                            nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                            usenameId: `${username(ctx)}`,
                            post: array1.post + 1,
                            type: 'video'
                        }
                        await saver.updateUser(user)
                    }else{
                        const user = {
                            chatId: ctx.chat.id,
                            userId: ctx.from.id,
                            nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                            usenameId: `${username(ctx)}`,
                            post: 0,
                            type: 'video'
                        }
                        await saver.saveUser(user)
                    }
                })
            }
        }else{
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                
            }
        }
    }
})

//Video files
bot.on('photo', async(ctx) => {
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)

        const query = {
          chatId: ctx.chat.id,
          userId: ctx.from.id
        }

        if(botStatus.status == 'administrator'){
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                await saver.checkUser(query).then(async res => {
                    if(res == true) {
                        const res1 = await saver.getUser(query)
                        const array1 = res1;
                        const user = {
                            chatId: ctx.chat.id,
                            userId: ctx.from.id,
                            nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                            usenameId: `${username(ctx)}`,
                            post: array1.post + 1,
                            type: 'photo'
                        }
                        await saver.updateUser(user)
                    }else{
                        const user = {
                            chatId: ctx.chat.id,
                            userId: ctx.from.id,
                            nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                            usenameId: `${username(ctx)}`,
                            post: 0,
                            type: 'photo'
                        }
                        await saver.saveUser(user)
                    }
                })
            }
        }else{
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                
            }
        }
    }
})
 
//heroku config
domain = `${process.env.DOMAIN}.herokuapp.com`
bot.launch({
    webhook:{
       domain:domain,
        port:Number(process.env.PORT) 
    }
})
