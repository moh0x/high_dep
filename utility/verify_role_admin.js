const { Admin } = require('../model/admin_model');
const verifyAdmin =async (req, res, next)=> {
    var token = req.headers.token;
    const admin = await Admin.findOne({token:token});
    if (admin) {

    next();

    } else {
      res.status(403).send({ "success": false, "message": "you don't have perrmision" })
    }
  }
  module.exports = {verifyAdmin};