// ---------- USER MODEL CREATION FOR DB------------ //
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {type: String, required: true},
    password: { type: String, required: true },
    photo: {type: String, default: 'https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png'},
    age: {type:Number},
    location:{type:String},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    hobbies: [{ type: Schema.Types.ObjectId, ref: 'Hobbie' }],
    status: {type:String, default:"Hi there! I'm not using Wh..., I'm using Phobbie."}
  },
  { versionKey: false }
)

const User = mongoose.model('User', userSchema)

module.exports = User