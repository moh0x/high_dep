const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema(
    {
        matricule: {
            type: String,
        },
        chauferName: {
            type: String,
        },
        marque: {
            type: String,
        },
        phoneNumber: {
            type: String,
           minlength:10,
           maxlength:10
        },
        kilomitrage:{
            type:String,
        },
        priceParKilomitre:{
            type:String,
        },
        priceTotal:{
            type:String,
        },
        kilomitrageBefore:{
            type:String,
        },
        assurance:{
            type:String,
        },
        Depart:{
            type:String,
            required:true,
        },
        Destination:{
            type:String,
            required:true,
        },
        isFinished:{
            type:Boolean,
            default:false
        },
        isAccept:{
            type:Boolean,
            default:false
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        longtitudeStart:{
            type:Number,
            default:0.7
        },
        latitudeStart:{
            type:Number,
            default:0.7
        },
        dateStartJourney:{
            type:Date
        },
        longtitudeEnd:{
            type:Number
        },
        latitudeEnd:{
            type:Number
        },
        dateEndJourney:{
            type:Date
        },
        kilomitragePaid:{
            type:String
        },
        cartGrisImage:{
            type:String
        },
        isPay:{
            type:Boolean,
            default:false
        }
    },
    { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = {Course}
