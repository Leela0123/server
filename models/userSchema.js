 const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.KEY;

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email address");
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    cpassword: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ],
    carts:Array
});




userSchema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    
    next();
    })
    
// generting token
//jwt has two things in it 1. Payload which contains user id that is provided to user
//2.A parameter which is a Secret Key of 32 words

// userSchema.methods.generateAuthToken = async function(){
//     try{
// let token = jwt.sign({_id:this._id},secretKey);
// this.tokens = this.tokens.concat({token:token})
// await this.save();
// return token;
//     }
//     catch(error){
// console.log(error);
//     }
// }


userSchema.methods.generateAuthToken = async function () {
    try {
      let token = jwt.sign({ _id: this._id }, secretKey, {
        expiresIn: "1d",
      });
  
      // Correctly store the generated token in the tokens array
     this.tokens.push({ token: token });
  
     await this.save();
      return token;
    } catch (error) {
      console.log(error);
    }
  };
  
  //ADD TO CART DATA
  userSchema.methods.addcartdata = async function(cart){
    try {
        this.carts = this.carts.concat(cart);
        await this.save();
        return this.carts;
    } catch (error) {
        console.log(error + "Error in adding cart");
    }
}

    
  
  
  
  
  

const SIGNUPDATA = new mongoose.model("signupdetail",userSchema);

module.exports = SIGNUPDATA;