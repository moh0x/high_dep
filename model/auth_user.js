const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		username:{
			type: String,
			
		},
		fullname: {
			type: String,
			required: true,
	
		},
		password: {
			type: String,
			required: true,
			minLength: 8,
		},
		email: {
			type: String,
			default:null,
		
		},
		token:{
			type:String,
			default:null
		},
        phoneNumber:{
            type:String,
            required:true,
            maxlength:10
        },
		latitude:{
			type:Number
		},
        logtitude:{
			type:Number
		},
        isOnline:{
            type:Boolean,
            default:false
        },
		isVerified:{
			type:Boolean,
			default:false
		},
		tokenNotificatin:{
			type:String
		},
		status:{
			type:String,
			enum:['offline','driving','online'],
			default:'offline'
		},
		city:{
			type:String,
			maxLength:50,	
		},
		isAssurance:{
			type:Boolean,
			default:false
		},
		cartGris:{
			type:String
		},
		permis:{
			type:String
		},
		drivingLicenece:{
			type:String
		},
		chaque:{
			type:String
		},
		isBanned:{
			type:Boolean,
			default:false
		},
		banned:{
			type:String
		},
		earnOneDay:{
			type:String,
			default:0
		},
		earnOneMonth:{
			type:String,
			default:0
		},
		matricule:{
			type:String,
	},
		date:{
			type:String
		},
		baladiya:{
			type:String
		},
		onwan:{
			type:String
		},
	},
	
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = {User}
