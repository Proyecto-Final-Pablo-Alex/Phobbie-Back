// ---------- IMPORT PACKAGES ----------- //
const express = require('express');
const router  = express.Router();

// ---------- IMPORT DB MODELS ----------- //
const FriendShip = require('../models/FriendShip.model');
const User = require('../models/User.model');
const Chat = require('../models/Chat.model')

// ---------- ROUTES ----------- //
// ---------- Send friend request route ----------- //
router.post('/send-request', (req, res) => {
    const {requester, recipient} = req.body

    FriendShip.find({$or: [{$and: [{recipient: recipient}, {requester: requester}]},{$and: [{recipient: requester}, {requester: recipient}]}]})
        .then(result => {
            if(!result.length > 0){
                FriendShip.create({requester,recipient})
                    .then(result=>{
                        res.status(201).send(result)
                    })
            }else{
                res.status(200).send({errorMessage: "Already requested"})
            }
        })
        .catch(error => {
            res.status(400).send({ message: 'Something went wrong' }, err)
        })  
})

// ---------- Accept friend request route ----------- //
router.post('/accept-request', (req, res) => {
    const {requester, recipient, _id} = req.body

    FriendShip.findByIdAndUpdate(_id, {status: "ACCEPTED"})
        .then(statusChanged=>{

            User.findByIdAndUpdate(requester, {$push: {friends: recipient}})
                .then((userUpdated)=>{

                    User.findByIdAndUpdate(recipient, {$push: {friends: requester}})
                        .then((user2Updated)=>{

                            Chat.create({participants: [requester, recipient]})
                                .then(result => {
                                    res.status(200).send({message:"Friend Req. Accepted"})
                                })   
                        })
                })
        })
        .catch(error => {
            res.status(400).send({ message: 'Something went wrong' }, err)
        })  
})

// ---------- Reject friend request route ----------- //
router.post('/reject-request', (req, res) => {
    const {_id} = req.body

    FriendShip.findByIdAndUpdate(_id, {status: "REJECTED"})
        .then(statusChanged=>{
            res.status(200).send({message:"Friend Req. Rejected"})
        })
        .catch(error=>{
            res.status(400).send({ message: 'Something went wrong' }, err)
        })
})

// ---------- Return all request the user has without response route ----------- //
router.post('/see-requests', (req, res) => {
    const {_id} = req.body

    FriendShip.find({recipient: _id, status: "REQUESTED"})
        .populate('requester')
        .then(result => {
            res.status(200).send(result)
        })
        .catch(error => {
            res.status(400).send({ message: 'Something went wrong' }, err)
        })
})

// ---------- Delete someone from your friends route ----------- //
router.post('/delete-friend', (req, res)=>{
    const {requester, recipient} = req.body
;
    FriendShip.find({$or: [{recipient, requester}, {recipient: requester, requester: recipient}]})
        .then(friendship=>{
            FriendShip.findByIdAndDelete(friendship[0]._id)
                .then(statusDeleted=>{
                    User.findByIdAndUpdate(requester, {$pull: {friends: recipient}})
                        .then((userUpdated)=>{
                            
                            User.findByIdAndUpdate(recipient, {$pull: {friends: requester}})
                                .then((user2Updated)=>{

                                    Chat.find({$and: [{participants: requester}, {participants: recipient}]})
                                        .then(chat => {
                                            
                                            Chat.findByIdAndDelete(chat[0]._id)
                                                .then(deleted => {
                                                    res.status(200).send({message:"Friend Deleted"})
                                                })
                                        })
                                })
                        })
                })
        })
        .catch(error => {
            res.status(400).send({ message: 'Something went wrong' }, err)
        })  
})


module.exports = router;