// ---------- IMPORT PACKAGES------------ //
const express = require('express')
const router  = express.Router()

// ---------- IMPORT DB MODELS ----------- //
const Chat = require('../models/Chat.model');

// ---------- ROUTES ----------- //
// ---------- Get all chats user participate route ----------- //
router.get("/return-all-chats/", (req, res)=>{
    Chat.find({participants: req.user._id}).sort({updatedAt: -1})
        .populate("participants")
        .then(result => {
            res.status(200).send(result)
        })
        .catch(error => {
            res.status(400).send({ message: 'Something went wrong' }, err)
        })
})

// ---------- Get a specific chat with a friend route----------- //
router.get("/return-chat/:_id", (req, res)=>{
    const {_id} = req.params

    Chat.find({$and: [{participants: req.user._id},{participants: _id}]})
        .populate("participants")
        .then(conversation => {
            const updatedMessages = conversation[0].messages.map(msg=>{
                if(msg.status === "UNREAD" && msg.username !== req.user.username){
                    msg.status = "READ"
                }
                return msg
            })

            Chat.findByIdAndUpdate(conversation[0]._id, {messages: updatedMessages}, {new: true})
                .populate('participants')
                .then(result => {
                    res.status(200).send(result)
                })
        })
        .catch(error => {
            res.status(400).send({ message: 'Something went wrong' }, err)
        }) 
})

// ---------- User message sent stored in DB route. ----------- //
router.post("/send-msg/:_id", (req, res)=>{
    const {_id} = req.params
    if (req.body.username === ''){
        return
    }else{
        Chat.findOne({$and: [{participants: req.user._id},{participants: _id}]})
            .then(chat => {
                Chat.findByIdAndUpdate(chat._id, {$push: {messages: req.body}}, {new: true})
                    .then(result => {
                        res.status(200).send(result)
                    })
            })
            .catch(error => {
                res.status(400).send({ message: 'Something went wrong' }, err)
            })
    }

})

module.exports = router