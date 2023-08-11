const jwt = require("jsonwebtoken");
const SIGNUPDATA = require("../models/userSchema");
const secretKey = process.env.KEY;

const athenticate = async(req,res,next)=>{
    try{
const token = req.cookies.Amazonclon;
const verifyToken = jwt.verify(token,secretKey);
console.log(verifyToken);

const rootUser = await SIGNUPDATA.findOne({_id:verifyToken._id,"tokens.token":token});
console.log(rootUser);

if(!rootUser){throw new Error("User not found")};
req.token = token
req.rootUser = rootUser
req.userID = rootUser._id

next();
    }
    catch(error){
res.status(401).send("unauthorised user:No token provided ");
console.log(error);
    }
}


module.exports = athenticate