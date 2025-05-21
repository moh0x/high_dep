const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
        userId:{
             type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: "User",
        },
       chauferName:{
        type:String,
       },
       numberOfCourses:{
        type:Number
       },
       chauferPay:{
        type:Number
       },
       status:{
        type:String,
        enum:['start','finish'],
        default:"finish"
       }
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = {Payment}
