const express = require('express');
const router  = express.Router();

const FriendShip = require('../models/FriendShip.model')

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
    res.send('index');
})

router.post('/reject-request', (req, res, next) => {
    res.send('index');
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

module.exports = router;