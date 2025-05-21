const express = require("express");
const port = 3000;
const app = express();
app.use(express.json());
const cors = require('cors')
app.use(cors())
const db = require('./db/db')
const userRoute = require('./routes/auth_user')
app.use('/api/auth/',userRoute)
const courseRoute = require('./routes/course_route')
app.use('/api/course/',courseRoute)
const serviceRoute = require('./routes/service_route')
app.use('/api/service/',serviceRoute)
const adminRoute = require('./routes/admin_route')
app.use('/api/admin/',adminRoute)
const paymentRoute = require('./routes/payments_route')
app.use('/api/payment/',paymentRoute)
const studentRoute = require('./routes/student_route')
app.use('/api/student/',studentRoute)
const maintenanceRoute = require('./routes/maintenance_route')
app.use('/api/maintenance/',maintenanceRoute)
const postRoute = require('./routes/post_routes')
app.use('/api/post/',postRoute)
const postMedcinRoute = require('./routes/post_medcin_routes')
app.use('/api/postMedcin/',postMedcinRoute)
// const ideaRoute = require('./routes/ideas_route')
// app.use('/api/idea/',ideaRoute)
app.listen(port,async()=>{
    console.log('connected');  
    await db.connectDb()
})
require('dotenv').config();




