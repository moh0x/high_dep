const mongoose = require('mongoose')

const connectDb = async()=>{
    try {
        await mongoose.connect("mongodb+srv://highdep603:2k4MnozzJUKWqb6c@highdep.fegh8bn.mongodb.net/?retryWrites=true&w=majority&appName=highdep");
        console.log('db connected');
        
    } catch (error) {
        console.log(error);
        
        console.log('error to connect to db');
        
    }
}
module.exports = {connectDb}
