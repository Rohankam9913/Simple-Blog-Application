const { Schema,model } = require("mongoose");

const commentSchema = new Schema({
    username : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },

    likes : {
        type : Number,
    },

    comment : {
        type : String,
    },

    blog : {
        type : Schema.Types.ObjectId,
        ref : "Blog"
    }
}, {timestamps : true});

const Comment = model("Comment",commentSchema);
module.exports = Comment;