const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
    {
       serviceName:{
        type:String
       }
    },
    { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
module.exports = {Service}
