const express = require('express');
const Chat = require('../models/Chat.model');
const router  = express.Router();

router.get("/return-all-chats/", (req, res)=>{
    Chat.find({participants: req.user._id})
    .populate("participants")
    .then(result => {
        res.send(result)
    })
    .catch(error => {
        console.log(error)
    })
})

router.get("/return-chat/:_id", (req, res)=>{
    const {_id} = req.params
    Chat.find({$and: [{participants: req.user._id},{participants: _id}]})
    .populate("participants")
    .then(result => {
        res.send(result)
    })
    .catch(error => {
        console.log(error)
    }) 
})

router.post("/send-msg/:_id", (req, res)=>{
    const {_id} = req.params
})

module.exports = router