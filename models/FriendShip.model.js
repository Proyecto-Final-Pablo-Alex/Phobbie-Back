// ---------- FRIENDSHIP MODEL CREATION FOR DB------------ //
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FriendShipSchema = new Schema(
  {
    requester: {type: Schema.Types.ObjectId, ref: 'User'},
    recipient: {type: Schema.Types.ObjectId, ref: 'User'},
    status:{type: String, enum: ["REQUESTED", "ACCEPTED", "REJECTED"], default: "REQUESTED"}
  },
  { versionKey: false }
)

const FriendShip = mongoose.model('FriendShip', FriendShipSchema)

module.exports = FriendShip