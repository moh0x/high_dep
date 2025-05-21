const mongoose = require('mongoose')

const ideaSchema = new mongoose.Schema(
    {
        userId:{
             type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: "User",
        },
       fullName:{
        type:String,
       },
       speciality:{
        type:String,
       },
       typeOfProgram:{
        type:String
       },
       titleOfProgram:{
        type:String
       },
       ideaOfProgram:{
        type:String
       },
       timeOfProgram:{
        type:String,
       },
       groupsOfProgram:{
        type:String,
       }
    },
    { timestamps: true }
);

const Idea = mongoose.model("Idea", ideaSchema);
module.exports = {Idea}
