const mongoose = require('mongoose')

const postsSchema = new mongoose.Schema(
    {
        userId:{
             type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: "User",
        },
       fullName:{
        type:String,
       },
       postTitle:{
        type:String,
       },
       postDetails:{
        type:String
       },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postsSchema);
module.exports = {Post}
