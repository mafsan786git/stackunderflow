const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonScheme = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String
    },
    profilepic:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = Person = mongoose.model('myperson',PersonScheme);