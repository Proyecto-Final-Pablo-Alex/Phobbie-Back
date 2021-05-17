// ---------- CHAT CONVERSATION MODEL CREATION FOR DB------------ //
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const chatSchema = new Schema(
  {
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{
      username: String, 
      date: Date, 
      message: String, 
      status: {type: String, enum: ["READ", "UNREAD"], default: "UNREAD"}
    }]
  },
  { versionKey: false }
)

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat