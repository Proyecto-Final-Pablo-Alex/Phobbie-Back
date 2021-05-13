const express = require('express');
const router  = express.Router();

const FriendShip = require('../models/FriendShip.model');
const User = require('../models/User.model');

/* GET home page */
router.post('/send-request', (req, res, next) => {
    const {requester, recipient} = req.body
    FriendShip.find({$and: [{recipient: recipient}, {requester: requester}]})
    .then(result => {
        if(!result.length > 0){
            FriendShip.create({requester,recipient})
            .then(result=>{
                res.send(result)
            })
        }else{
            res.send({errorMessage: "Already requested"})
        }
    })
    .catch(error => {
        console.log(error)
    })  
})

router.post('/accept-request', (req, res, next) => {
    const {requester, recipient, _id} = req.body
    FriendShip.findByIdAndUpdate(_id, {status: "ACCEPTED"})
    .then(statusChanged=>{
        User.findByIdAndUpdate(requester, {$push: {friends: recipient}})
        .then((userUpdated)=>{
            User.findByIdAndUpdate(recipient, {$push: {friends: requester}})
            .then((user2Updated)=>{
                res.send({message:"Friend Req. Accepted"})
            })
        })
    })
    .catch(error => {
        console.log(error)
    })  
})

router.post('/reject-request', (req, res, next) => {
    const {requester, recipient, _id} = req.body
    FriendShip.findByIdAndUpdate(_id, {status: "REJECTED"})
    .then(statusChanged=>{
        res.send({message:"Friend Req. Rejected"})
    })
    .catch(error=>{
        console.log(error)
    })
})

router.post('/see-requests', (req, res, next) => {
    const {_id} = req.body
    FriendShip.find({recipient: _id, status: "REQUESTED"})
    .populate('requester')
    .then(result => {
        // console.log(result)
        res.send(result)
    })
    .catch(error => {
        console.log(error)
    })
})

router.post('/delete-friend', (req, res)=>{
    const {requester, recipient} = req.body
    FriendShip.find({recipient, requester})
    .then(result=>{
        if(result.length > 0 ){
            FriendShip.findByIdAndDelete(result[0]._id)
            .then(statusDeleted=>{
                User.findByIdAndUpdate(requester, {$pull: {friends: recipient}})
                .then((userUpdated)=>{
                    User.findByIdAndUpdate(recipient, {$pull: {friends: requester}})
                    .then((user2Updated)=>{
                        res.send({message:"Friend Deleted"})
                    })
                })
            })
        }else{
            FriendShip.find({recipient: requester, requester: recipient})
            .then(result2 => {
                FriendShip.findByIdAndDelete(result2[0]._id)
                .then(statusDeleted=>{
                    User.findByIdAndUpdate(requester, {$pull: {friends: recipient}})
                    .then((userUpdated)=>{
                        User.findByIdAndUpdate(recipient, {$pull: {friends: requester}})
                        .then((user2Updated)=>{
                            res.send({message:"Friend Deleted"})
                        })
                    })
                })
            })
        }
    })
    .catch(error => {
        console.log(error)
    })  
})


module.exports = router;