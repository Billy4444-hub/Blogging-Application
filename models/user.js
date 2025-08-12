const { name } = require('ejs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydatabaseP1')

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    email: String,  
    password: String,
    age: Number,
    profilePic: {
        type: String,
        default: 'default.jpg' // Default profile picture
    },
    post: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'post'
        }
    ]
})

const user = mongoose.model('user', userSchema);
module.exports = user;