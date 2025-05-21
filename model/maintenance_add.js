const mongoose = require('mongoose')

const maintenanceSchema = new mongoose.Schema(
    {
        userId:{
             type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: "User",
        },
       fullName:{
        type:String,
       },
       typeOfMaintenance:{
        type:String,
        enum: ['كهرباء', 'سباكة', 'نجارة'],
       },
       details:{
        type:String
       },
       roomNumber:{
        type:String
       },
       status:{
        type:String,
        enum:['agree','not agree'],
        default:'not agree'
       }
    },
    { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
module.exports = {Maintenance}
