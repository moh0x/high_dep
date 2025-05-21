const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
        },
        token:{
            type:String,
            default:null
        },
       isAdmin:{
        type:Boolean,
        default:false
       }
    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = {Admin}
