const {Client,Intents} = require('discord.js');
const DB = require('./db')
const dotenv = require('dotenv');
const { Db } = require('mongodb');
const moment = require('moment')
const _ = require('lodash');
dotenv.config();

// var app = require('express')();

// var listener = app.listen(8888, function(){
//     console.log('Listening on port ' + listener.address().port); //Listening on port 8888
// });


const client = new Client (
    {
        intents:[
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
        ]
    }
)

client.on('ready',()=>{
    console.log("My bot is ready")
})
client.on('messageCreate', async msg=>{

    const formatDateTime = "YYYY-MM-DD HH:mm:ss"
    const formatDate = "YYYY-MM-DD"

    var date = new Date();
    var dateCheckInOut = moment(date).format(formatDateTime);
    var currentDate = moment(date).format(formatDate);

    var conditionFindData = { name: msg.author.username,currentDate:currentDate }
    let findData = await DB.findData(process.env.CHECKIN_COLLECTION,conditionFindData);
    let msgContent = msg.content.toLowerCase();
    
    if(msgContent==='!checkin' && findData.length===0)
    {
        var insertData = { name: msg.author.username,checkin:dateCheckInOut ,checkout:"",currentDate:currentDate}

        await DB.insertData(process.env.CHECKIN_COLLECTION,insertData);

        msg.channel.send(msg.author.username + '  login at :  ' + dateCheckInOut);
    }
    else if(msgContent==='!checkout')
    {
        var updateData = { checkout: dateCheckInOut }
        var conditionUpdateData = { name: msg.author.username }
        await DB.updateData(process.env.CHECKIN_COLLECTION,conditionUpdateData,updateData);

        msg.channel.send(msg.author.username + '  login out :  ' + dateCheckInOut);

    }
    else if(msgContent==='!total')
    {
        let findData = await DB.findUnique(process.env.CHECKIN_COLLECTION,"name");
        
        msg.channel.send("มีคนล็อกอินวันนี้ทั้งหมด " + findData.length + " คน")
    }
    else if(msgContent==='!docker')
    {
        var conditionFindData = { Type: "Docker" }
        let findData = await DB.findData(process.env.LISTCOMMAND_COLLECTION,conditionFindData);
        _.forEach(findData,function(data){
            msg.channel.send("Type Command : " + data.Type + "\r\n" + "Docker Command : " + data.Command + "\r\n" + "Docker Message : " + data.Message);
        })
    }
    else if(msgContent==='!kubectl')
    {
        var conditionFindData = { Type: "Kubectl" }
        let findData = await DB.findData(process.env.LISTCOMMAND_COLLECTION,conditionFindData);
        _.forEach(findData,function(data){
            msg.channel.send("Type Command : " + data.Type + "\r\n" + "Kubectl Command : " + data.Command + "\r\n" + "Kubectl Message : " + data.Message);
        })
    }
    
})


client.login(process.env.TOKEN)
