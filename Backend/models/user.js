const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    email: String,  
    password: String,
    age: Number,
    profilePic: {
        type: String,
        default: "http://localhost:4001/static/default.png",
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