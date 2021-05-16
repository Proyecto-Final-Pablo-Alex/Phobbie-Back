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

// router.get("/return-chat/:id", (req, res)=>{
    
// })

module.exports = router