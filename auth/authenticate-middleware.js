const jwt = require('jsonwebtoken')
const secret = require('../config/vars').jwtSecret
/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = (req, res, next) => {

  const token = req.headers.authorization
  if (token)
  {
    jwt.verify(token, secret, (err, decodedToken)=>{
      if(err){
        res.status(401).json({Message: "No Pass For You"})
      }
      else{
        req.jwt = decodedToken
        next()
      }
    })
  }
  else{
    res.status(400).json({message:"Please provide authentication information"})
  }

};
