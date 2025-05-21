const httpStatus = require('../constant/httpStatus')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const { Service } = require('../model/service_model')
const { User } = require('../model/auth_user')

const deleteService =  async (req, res) => {
    try {
    const service = await Service.findOne({_id:req.body._id})         
 if (service) {
  await Service.findByIdAndDelete(service._id)
  res.status(200).json({"status":httpStatus.SUCCESS,"data":null})  
 } else {
  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no course"})  
 }
    } catch (error) {
        console.log("Error in service delete controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const addService =  async (req, res) => {
    try {
       const valid = validationResult(req)
              if (!valid.isEmpty()) {
                return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
          }
    const{serviceName}=req.body
    const service = new Service({
      serviceName:serviceName
    })       

  await service.save();
  res.status(200).json({"status":httpStatus.SUCCESS,"data":service})  
    } catch (error) {
        console.log("Error in service add controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const services = async (req,res)=>{
    try {
      const services = await Service.find().sort({createdAt:-1});
      res.status(200).json({"status":httpStatus.SUCCESS,"data":services})
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {deleteService,services,addService}