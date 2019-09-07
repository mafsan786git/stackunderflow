const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'myperson'
    },
    textOne:{
        type:String,
        required:true
    },
    textTwo:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    upVotes:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'myperson'
            }
        }
    ],
    answers:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'myperson'
            },
            text:{
                type:String,
                required:true
            },
            name:{
                type:String,

            },
            date:{
                type:Date,
                default:Date.now
            },
        }
    ],
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=Questions=mongoose.model('myQuestion',QuestionSchema);