const httpStatus = require('../constant/httpStatus')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const { Course } = require('../model/course_controller')
const { Payment } = require('../model/payments_model')
const { User } = require('../model/auth_user')
const cloudinary=require( "cloudinary").v2;
const admin = require("firebase-admin");
const serviceAccount = require("../utility/cli2-19164-firebase-adminsdk-fbsvc-e534bb8a42.json");



async function sendNotification(title, body, token) {
  const message = {
    notification: { title, body },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("تم إرسال الإشعار:", response);
    return response;
  } catch (error) {
    console.error("خطأ في إرسال الإشعار:", error);
    throw error;
  }
}
const addPayment =  async (req, res) => {
    try {
        
    const{userId}=req.body
    const user = await User.findOne({_id:userId});    
    const courses = await Course.find({userId:user.id,isFinished:true,isAccept:true,isPay:false});
    const payment = new Payment({
      userId:userId,
      numberOfCourses:courses.length,
      chauferPay:user.earnOneMonth,
      chauferName:user.fullname,
    })       
    for (let index = 0; index < courses.length; index++) {
        await Course.findByIdAndUpdate(courses[index].id,{
            $set:{
                isPay:true
            }
            
        })
        await courses[index].save()
    }
   const retUser = await User.findByIdAndUpdate(user.id,{
      $set:{
        earnOneDay:0,
        earnOneMonth:0
      }
    })
    await retUser.save();
  await payment.save();
  await sendNotification("الدفع مكتمل"," تم دفع المستحقات.نقدر ثقتك بنا.",user.tokenNotificatin)
  res.status(200).json({"status":httpStatus.SUCCESS,"data":payment})  
    } catch (error) {
        console.log(error);
        
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const addPaymentDaily =  async (req, res) => {
    try {
        
    const{userId,earnOneDay}=req.body
    const user = await User.findOne({_id:userId}); 
    const   earnOneMonth = +earnOneDay + +user.earnOneMonth 
   const retUser = await User.findByIdAndUpdate(user.id,{
      $set:{
        earnOneDay:earnOneDay,
        earnOneMonth:earnOneMonth
      }
    })
    await retUser.save();
  res.status(200).json({"status":httpStatus.SUCCESS,"data":user})  
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
const paymentsAdmin = async (req,res)=>{
  try {
    const payments = await Payment.find().sort({createdAt:-1});
    res.status(200).json({"status":httpStatus.SUCCESS,"data":payments})
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const payments = async(req,res)=>{
  const token= req.headers.token;
  
  const user = await User.findOne({token:token});
  
if (!user) {
  return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id"})
}
const payments = await Payment.find({userId:user.id})
res.status(200).json({"status":httpStatus.SUCCESS,"data":payments})
}
// const startCourse =  async (req, res) => {
//     try {
//     const{longtitudeStart,latitudeStart,courseId}=req.body;
//     const token = req.headers.token;
//     const user = await User.findOne({token:token})
//    const course = await Course.findById(courseId);
//    if (!course) {
//    return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Course Not Found" });
//    }  
//    if (course.userId != user.id) {
//    return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Not Aauthorized" });
//    }    
//    await Course.findByIdAndUpdate(courseId,{
//     $set:{
//       longtitudeStart:longtitudeStart,
//       latitudeStart:latitudeStart,
//       dateStartJourney:Date.now(),
//       isAccept:true
//     }
//    })
//    await User.findByIdAndUpdate(user._id,{
//     $set:{
//       status:'online'
//     }
//    })
//    await user.save();
//   await course.save();
//   res.status(200).json({"status":httpStatus.SUCCESS,"data":course})  
//     } catch (error) {
//         console.log("Error in start course controller", error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };
// const finishCourse =  async (req, res) => {
//     try {
//     const{longtitudeEnd,latitudeEnd,courseId,kilomitragePaid,profilePic,priceParKilomitre}=req.body;
//     const token = req.headers.token;
//     const user = await User.findOne({token:token})
//    const course = await Course.findById(courseId);
//    if (!course) {
//    return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Course Not Found" });
//    }  
//    if (course.userId != user.id) {
//    return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message": "Not Aauthorized" });
//    }   
//    await Course.findByIdAndUpdate(courseId,{
//     $set:{
//       longtitudeEnd:longtitudeEnd,
//       latitudeEnd:latitudeEnd,
//       dateEndJourney:Date.now(),
//       kilomitragePaid:kilomitragePaid,
//       cartGrisImage:cartGrisImage,
//       priceParKilomitre:priceParKilomitre,
//       isFinished:true
//     }
//    })
//    await User.findByIdAndUpdate(user._id,{
//     $set:{
//       status:'online'
//     }
//    })
//    await user.save();
//   await course.save(); 
//   res.status(200).json({"status":httpStatus.SUCCESS,"data":course})  
//     } catch (error) {
//         console.log("Error in start course controller", error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };
const paymentOneUser= async(req,res)=>{
  const{_id}= req.body
  
  const user = await User.findById(_id);
  
if (!user) {
  return res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id"})
}
const payments = await Payment.find({userId:user.id})
res.status(200).json({"status":httpStatus.SUCCESS,"data":payments})
}
module.exports = {addPayment,paymentOneUser,paymentsAdmin,payments,addPaymentDaily}
