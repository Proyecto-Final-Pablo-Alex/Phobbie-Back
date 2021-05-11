const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    age: {type:Number},
    location:{type:String},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    hobbies: [{ type: Schema.Types.ObjectId, ref: 'Hobby' }],
  },
  { versionKey: false }
)

const User = mongoose.model('User', userSchema)

module.exports = User
