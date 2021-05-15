const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema(
  {
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
    room: String, 
    messages: [{username: String, date: Date, message: String}],
  },
  { versionKey: false }
)

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat