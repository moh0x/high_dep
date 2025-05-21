const mongoose = require('mongoose')

const connectDb = async()=>{
    try {
        await mongoose.connect("mongodb+srv://sogaimohamedamine:uwPspP1wg8TrhSp9@cluster0.dhfkbeg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log('db connected');
        
    } catch (error) {
        console.log(error);
        
        console.log('error to connect to db');
        
    }
}
module.exports = {connectDb}