const httpStatus = require('../constant/httpStatus')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const { Course } = require('../model/course_controller')
const { Maintenance } = require('../model/maintenance_add')
const { User } = require('../model/auth_user')
const { Student } = require('../model/student_model')
const cloudinary=require( "cloudinary").v2;

const addMaintenance =  async (req, res) => {
    try {      
    const{userId,fullName,typeOfMaintenance,details,roomNumber}=req.body  
    const maintenance = new Maintenance({
      userId:userId,
      fullName:fullName,
      typeOfMaintenance:typeOfMaintenance,
      details:details,
      roomNumber:roomNumber
    })       
  await maintenance.save();
  res.status(200).json({"status":httpStatus.SUCCESS,"data":maintenance})  
    } catch (error) {
        console.log(error);
        
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// const courseInfo = async (req,res)=>{
//   try {
//     const courseId = req.params.id;
//     const course = await Course.findOne({_id:courseId});
//         res.status(200).json({"status":httpStatus.SUCCESS,"data":course})
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
// const courses = async (req,res)=>{
//     try {
//         const token = req.headers.token;
//       const user = await User.findOne({token:token})
//       const courses = await Course.find({userId:user._id}).sort({createdAt:-1});
//       res.status(200).json({"status":httpStatus.SUCCESS,"data":courses})
//     } catch (error) {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
// }
// const paymentsAdmin = async (req,res)=>{
//   try {
//     const payments = await Payment.find().sort({createdAt:-1});
//     res.status(200).json({"status":httpStatus.SUCCESS,"data":payments})
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// // const startCourse =  async (req, res) => {
// //     try {
// //     const{longtitudeStart,latitudeStart,courseId}=req.body;
// //     const token = req.headers.token;
// //     const user = await User.findOne({token:token})
// //    const course = await Course.findById(courseId);
// //    if (!course) {
// //    return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Course Not Found" });
// //    }  
// //    if (course.userId != user.id) {
// //    return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Not Aauthorized" });
// //    }    
// //    await Course.findByIdAndUpdate(courseId,{
// //     $set:{
// //       longtitudeStart:longtitudeStart,
// //       latitudeStart:latitudeStart,
// //       dateStartJourney:Date.now(),
// //       isAccept:true
// //     }
// //    })
// //    await User.findByIdAndUpdate(user._id,{
// //     $set:{
// //       status:'online'
// //     }
// //    })
// //    await user.save();
// //   await course.save();
// //   res.status(200).json({"status":httpStatus.SUCCESS,"data":course})  
// //     } catch (error) {
// //         console.log("Error in start course controller", error.message);
// //         res.status(500).json({ error: "Internal Server Error" });
// //     }
// // };
// // const finishCourse =  async (req, res) => {
// //     try {
// //     const{longtitudeEnd,latitudeEnd,courseId,kilomitragePaid,profilePic,priceParKilomitre}=req.body;
// //     const token = req.headers.token;
// //     const user = await User.findOne({token:token})
// //    const course = await Course.findById(courseId);
// //    if (!course) {
// //    return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Course Not Found" });
// //    }  
// //    if (course.userId != user.id) {
// //    return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Not Aauthorized" });
// //    }   
// //    await Course.findByIdAndUpdate(courseId,{
// //     $set:{
// //       longtitudeEnd:longtitudeEnd,
// //       latitudeEnd:latitudeEnd,
// //       dateEndJourney:Date.now(),
// //       kilomitragePaid:kilomitragePaid,
// //       cartGrisImage:cartGrisImage,
// //       priceParKilomitre:priceParKilomitre,
// //       isFinished:true
// //     }
// //    })
// //    await User.findByIdAndUpdate(user._id,{
// //     $set:{
// //       status:'online'
// //     }
// //    })
// //    await user.save();
// //   await course.save(); 
// //   res.status(200).json({"status":httpStatus.SUCCESS,"data":course})  
// //     } catch (error) {
// //         console.log("Error in start course controller", error.message);
// //         res.status(500).json({ error: "Internal Server Error" });
// //     }
// // };
const maintenanceOneUser= async(req,res)=>{
  const token= req.headers.token;
  
  const student = await Student.findOne({token:token});
  
if (!student) {
  return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id"})
}
const maintenance = await Maintenance.find({userId:student.id}).sort({createdAt:-1})
res.status(200).json({"status":httpStatus.SUCCESS,"data":maintenance})
}
const maintenanceStatics =async(req,res)=>{
  try {
    const now = Date.now();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now - 48 * 60 * 60 * 1000);
    const allMaintenances = await Maintenance.find();
    const aggreeMaintenances = await Maintenance.find({status:'agree'});
const nowMaintenances = await Maintenance.find({
  createdAt: { $gt: oneDayAgo }
});

const oneDayMaintenances = await Maintenance.find({
  createdAt: { $gt: twoDaysAgo, $lt: oneDayAgo }
});

const twoDaysMaintenances = await Maintenance.find({
  createdAt: { $lt: twoDaysAgo }
});
res.status(200).json({"status":httpStatus.SUCCESS,"data":{"twoDaysMaintenances":twoDaysMaintenances.length,"oneDayMaintenances":oneDayMaintenances.length,"nowMaintenances":nowMaintenances.length,"aggreeMaintenances":aggreeMaintenances.length,"allMaintenances":allMaintenances.length,"aggreeMaintenances":aggreeMaintenances.length}})
  } catch (error) {
    res.status(500).json({"status":httpStatus.ERROR,"message":"error"})
  }
}
const maintenanceByType=async(req,res)=>{
 try {
  const token = req.headers.token;
  const student = await Student.findOne({token:token});
  const maintenances = await Maintenance.find({typeOfMaintenance:student.typeOfMaintenance})
  res.status(200).json({"status":httpStatus.SUCCESS,"data":maintenances})
 } catch (error) {
  console.log(error);
        
  console.log("Error in logout controller", error.message);
  res.status(500).json({ error: "Internal Server Error" });
 }
}
const maintenanceType=async(req,res)=>{
  try {
   const type = req.body.type;
   const maintenances = await Maintenance.find({typeOfMaintenance:type})
   res.status(200).json({"status":httpStatus.SUCCESS,"data":maintenances})
  } catch (error) {
   console.log(error);
         
   console.log("Error in logout controller", error.message);
   res.status(500).json({ error: "Internal Server Error" });
  }
 }
 const maintenanceDelete=async(req,res)=>{
  try {
   const id = req.body.id;
   const maintenances = await Maintenance.find({id:id})
   await Maintenance.findByIdAndDelete(maintenances.id)
   res.status(200).json({"status":httpStatus.SUCCESS,"data":null})
  } catch (error) {
   console.log(error);
         
   console.log("Error in logout controller", error.message);
   res.status(500).json({ error: "Internal Server Error" });
  }
 }
module.exports = {addMaintenance,maintenanceOneUser,maintenanceStatics,maintenanceByType,maintenanceType,maintenanceDelete}