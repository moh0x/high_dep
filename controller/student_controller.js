const {Student} = require('../model/student_model')
const {User} = require('../model/auth_user')
const {Course} = require('../model/course_controller')
const httpStatus = require('../constant/httpStatus')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const { Payment } = require('../model/payments_model')
const signUp =async(req,res)=>{
    try {
        const valid = validationResult(req)
        if (!valid.isEmpty()) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
        }
        const {email,password} = req.body      
        const student = await Student.findOne({email:email});
        if (student) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"student already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword =await bcrypt.hash(password,salt)
        const token = jwt.sign({email:email},"token")
        const newStudent = new Student({
            email:email,
            password:hashPassword,
            token:token
        })
        await newStudent.save()  
              res.status(200).json({"status":httpStatus.SUCCESS,"data":newStudent})     
    } catch (error) {
        console.log(error);
          res.status(400).json({"status":httpStatus.ERROR,"message":"error"})  
    }
}
const login =async(req,res)=>{
  try {
    const{email,password} = req.body
  const student = await Student.findOne({email : email},{__v:false});
 const valid = validationResult (req);

if (valid.isEmpty()) {
if (student) {
   
 const passwordMatch = await bcrypt.compare(password,student.password);
    if (passwordMatch == true) {
            const studentRet = await Student.findOne({email : email},{__v:false,password:false});
            res.status(200).json({"status":httpStatus.SUCCESS,"data":studentRet});
        
    } else {
        res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"password not match"});
    }
   } else {
    res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no admin with this email"});
   }
} else {
res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
}
 } catch (error) {
  console.log(error);
  
    res.status(400).json({"status":httpStatus.ERROR,"data":null,"message":"error"});
 }

}
const studentInfo = async (req,res)=>{
  try {
    const token = req.headers.token;
    const student = await Student.findOne({token:token},{password:false})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":student})
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = {signUp,login,studentInfo}