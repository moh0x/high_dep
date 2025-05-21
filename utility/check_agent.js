const { User } = require('../model/User');
const checkAgent =async (req, res, next)=> {
    var token = req.headers.token;
    const user = await User.findOne({token:token});
    if (user) {
  if (user.isAgent == false) {
    next();
  }
  else{
    res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
    } else {
      res.status(403).send({ "success": false, "message": "you don't have perrmision" })
    }
  }
  module.exports = {checkAgent};