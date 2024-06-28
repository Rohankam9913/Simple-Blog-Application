const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title : {
        type : String
    },

    description : {
        type : String
    },

    content : {
        type : String
    },

    tags : {
        type : [String]
    },

    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true});

const Blog = model("Blog",blogSchema);

module.exports = Blog;