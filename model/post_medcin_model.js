const mongoose = require('mongoose')

const postMedcinSchema = new mongoose.Schema(
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
       postImage:{
        type:String
       },
       postVideo:{
        type:String
       },
       postType:{
        type:String
       }
    },
    { timestamps: true }
);

const PostMedcin = mongoose.model("PostMedcin", postMedcinSchema);
module.exports = {PostMedcin}
