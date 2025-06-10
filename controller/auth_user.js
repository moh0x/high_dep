const {User} = require('../model/auth_user')
const httpStatus = require('../constant/httpStatus')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const { Admin } = require('../model/admin_model')
const changeUserStates =  async(req,res)=>{
  try {
    const token = req.headers.token;
       const user = await User.findOne({token:token})
       console.log(user);
     if (!user) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(user.id,{
      $set:{
        status:user.status =='online'?'offline': 'online'
      }
     })
     await user.save();
       res.status(200).json({"status":httpStatus.SUCCESS,"data":user});

  } catch (error) {
	  console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const ban =  async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    const{_id,banned}=req.body;
    console.log(_id);
    
       const user = await User.findOne({_id:_id})
       console.log(user);
       
     if (!user) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(user.id,{
      $set:{
        isBanned:true,
        banned:banned
      }
     })
     await user.save();
       res.status(200).json({"status":httpStatus.SUCCESS,"data":user});

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const disBan =  async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    const{_id}=req.body;
  
       const user = await User.findOne({_id:_id})
       console.log(user);
       
     if (!user) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(user.id,{
      $set:{
        isBanned:false
      }
     })
     await user.save();
       res.status(200).json({"status":httpStatus.SUCCESS,"data":user});

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const signUp =async(req,res)=>{
    try {
        const valid = validationResult(req)
        if (!valid.isEmpty()) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
        }
        const {fullname,password,phoneNumber,cartGris,permis,drivingLicence,chaque,isAssurance,matricule,addresse,date,baladiya,onwan} = req.body      
        const user = await User.findOne({phoneNumber:phoneNumber});
        if (user) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"user already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword =await bcrypt.hash(password,salt)
        const token = jwt.sign({phoneNumber:phoneNumber,fullname:fullname},"token")
        const newUser = new User({
          username:fullname,
            fullname:fullname,
            password:hashPassword,
            token:token,
            phoneNumber:phoneNumber,
            cartGris:cartGris,
            permis:permis,
            chaque:chaque,
            drivingLicenece:drivingLicence,
            isAssurance:isAssurance,
		matricule:matricule,
		city:addresse,
		date:date,
    baladiya:baladiya,
    onwan:onwan
        })
        await newUser.save()  
              res.status(200).json({"status":httpStatus.SUCCESS,"data":newUser})     
    } catch (error) {
        console.log(error);
          res.status(400).json({"status":httpStatus.ERROR,"message":"error"})  
    }
}
const login =async(req,res)=>{
  try {
    const{phoneNumber,password} = req.body
  const user = await User.findOne({phoneNumber : phoneNumber},{__v:false});
 const valid = validationResult (req);

if (valid.isEmpty()) {
if (user) {
   
 const passwordMatch = await bcrypt.compare(password,user.password);
    if (passwordMatch == true) {
            const userRet = await User.findOne({phoneNumber : phoneNumber},{__v:false,password:false});
            res.status(200).json({"status":httpStatus.SUCCESS,"data":userRet});
        
    } else {
        res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"password not match"});
    }
   } else {
    res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this number"});
   }
} else {
res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
}
 } catch (error) {
  console.log(error);
  
    res.status(400).json({"status":httpStatus.ERROR,"data":null,"message":"error"});
 }

}

const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const updateProfile =  async (req, res) => {
	try {
		const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
    const{logtitude,latitude,isOnline,status,email,isAssurance,city,fullname,date,matricule,baladiya,onwan} = req.body
  await User.findByIdAndUpdate(user._id,{ 
    $set:{
      logtitude:logtitude,
      latitude:latitude,
      isOnline:isOnline ?? user.isOnline,
      status:status ?? user.status,
      email:email ?? user.email,
      isAssurance:isAssurance ?? user.isAssurance,
      city:city ?? user.city,
      fullname:fullname ?? user.fullname,
	    date:date ??user.date,
	    matricule:matricule ??user.matricule,
      baladiya:baladiya ?? user.baladiya,
      onwan:onwan ?? user.onwan
    }
  })
  await user.save()
  res.status(200).json({"status":httpStatus.SUCCESS,"data":user})  
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const userInfo = async (req,res)=>{
  try {
    const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":user})
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const updateNotificationToken =  async (req, res) => {
	try {
		const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
    const{tokenNotificatin} = req.body
  await User.findByIdAndUpdate(user._id,{ 
    $set:{
      tokenNotificatin:tokenNotificatin
    }
  })
  res.status(200).json({"status":httpStatus.SUCCESS,"data":user})  
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
const deleteUser = async (req,res)=>{
  try {
    const token = req.headers.token;
    const user = await User.findOne({token:token},{password:false})
       await User.findByIdAndDelete(user._id); 
       res.status(200).json({"status":httpStatus.SUCCESS,"data":null });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const getInActiveUsers = async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    
       const inActiveUsers = await User.find({isVerified:false}).sort({createdAt:-1})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":inActiveUsers});
      
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const activeUser = async(req,res)=>{
  try {
    const _id=req.body._id;
       const inActiveUser = await User.findOne({_id:_id})
       console.log(inActiveUser);
       
     if (!inActiveUser) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(inActiveUser.id,{
      $set:{
        isVerified:true,
        isBanned:false,
        banned:null
      }
     })
     await inActiveUser.save();
       const retUser = await User.findOne({_id:_id})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":retUser});

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const getActiveUsers = async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    
       const activeUsers = await User.find({isVerified:true}).sort({createdAt:-1})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":activeUsers});
      
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const inActiveUser = async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    const{_id}=req.body._id;
       const activeUser = await User.findOne({id:_id})
     if (!activeUser) {
    return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no user with this id" });
     }
     await User.findByIdAndUpdate(activeUser.id,{
      $set:{
        isVerified:false
      }
     })
     await activeUser.save();
       const retUser = await User.findOne({id:_id})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":retUser});

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const privacy = (req,res)=>{
  res.write(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <meta name='viewport' content='width=device-width'>
      <title>Privacy Policy</title>
      <style> body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding:1em; } </style>
    </head>
    <body>
    <strong>Privacy Policy</strong>

<p>This privacy policy applies to the HighDep app (hereby referred to as "Application") for mobile devices that was created by mohamed (hereby referred to as "Service Provider") as a Commercial service. This service is intended for use "AS IS".</p><br><strong>Information Collection and Use</strong>

<p>The Application collects information when you download and use it. This information may include information such as</p>  
<ul>
  <li>Your device's Internet Protocol address (e.g. IP address)</li>
  <li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li>
  <li>The time spent on the Application</li>
  <li>The operating system you use on your mobile device</li>
</ul><p></p><br><p>The Application does not gather precise information about the location of your mobile device.</p>  <div style="display: none;">  
<p>The Application collects your device's location, which helps the Service Provider determine your approximate geographical location and make use of in below ways:</p>  
<ul>
  <li>Geolocation Services: The Service Provider utilizes location data to provide features such as personalized content, relevant recommendations, and location-based services.</li>
  <li>Analytics and Improvements: Aggregated and anonymized location data helps the Service Provider to analyze user behavior, identify trends, and improve the overall performance and functionality of the Application.</li>
  <li>Third-Party Services: Periodically, the Service Provider may transmit anonymized location data to external services. These services assist them in enhancing the Application and optimizing their offerings.</li>
</ul>  
</div><br><p>The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions.</p><br><p>For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information, including but not limited to Contact@highdep.com. The information that the Service Provider request will be retained by them and used as described in this privacy policy.</p><br><strong>Third Party Access</strong>

<p>Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.</p>  
<div><br>  
<p>Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:</p>  
<ul>
  <li><a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer">Google Play Services</a></li>
  <li><a href="https://support.google.com/admob/answer/6128543?hl=en" target="_blank" rel="noopener noreferrer">AdMob</a></li>
</ul>  
</div><br><p>The Service Provider may disclose User Provided and Automatically Collected Information:</p>  
<ul>
  <li>as required by law, such as to comply with a subpoena, or similar legal process;</li>
  <li>when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</li>
  <li>with their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.</li>
</ul><p></p><br><strong>Opt-Out Rights</strong>

<p>You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.</p><br><strong>Data Retention Policy</strong>

<p>The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at Contact@highdep.com and they will respond in a reasonable time.</p><br><strong>Children</strong>

<p>The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.</p>  
<div><br>  
<p>The Application does not address anyone under the age of 13. The Service Provider does not knowingly collect personally identifiable information from children under 13 years of age. In the case the Service Provider discover that a child under 13 has provided personal information, the Service Provider will immediately delete this from their servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact the Service Provider (Contact@highdep.com) so that they will be able to take the necessary actions.</p>  
</div><br><strong>Security</strong>

<p>The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.</p><br><strong>Changes</strong>

<p>This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.</p><br><p>This privacy policy is effective as of 2024-07-14</p><br><strong>Your Consent</strong>

<p>By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.</p><br><strong>Contact Us</strong>

<p>If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at Contact@highdep.com.</p>
    </body>
    </html>
      `);
  res.end();
}
const deleteGoogle = (req,res)=>{
  res.write(`<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <title>حذف الحساب - HighDep</title>
</head>
<body>
  <h1>حذف حساب المستخدم - HighDep</h1>

  <p>إذا كنت ترغب في حذف حسابك على تطبيق HighDep، يرجى اتباع الخطوات التالية:</p>

  <ol>
    <li>افتح تطبيق HighDep على هاتفك.</li>
    <li>اذهب إلى "الإعدادات" ثم اختر "حذف الحساب".</li>
    <li>قم بتأكيد عملية الحذف.</li>
  </ol>

  <p>كما يمكنك طلب حذف حسابك عبر البريد الإلكتروني التالي:</p>
  <p><strong>📧 Contact@highdep.com</strong></p>

  <h2>ما هي البيانات التي سيتم حذفها؟</h2>
  <ul>
    <li>الاسم الشخصي</li>
    <li>البريد الإلكتروني</li>
    <li>سجل النشاطات</li>
  </ul>

  <p>لن يتم الاحتفاظ بأي من بياناتك بعد حذف الحساب.</p>
</body>
</html>


  `);
  res.end();
}

module.exports = {deleteGoogle,privacy,signUp,login,logout,updateProfile,userInfo,updateNotificationToken,deleteUser,getInActiveUsers,activeUser,getActiveUsers,inActiveUser,ban,disBan,changeUserStates}
