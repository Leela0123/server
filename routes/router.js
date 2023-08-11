const express = require("express");
// for calling api trhough express.Router
const router = new express.Router();
const Products = require("../models/productsSchema");
const SIGNUPDATA = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const athenticate = require("../middleware/authenticate")




// get the products data through api 

 router.get("/getproducts", async (req, res) => {
   console.log(res);
   try {
    //find method is used to find the data is a mongo db method
       const productsdata = await Products.find();
        console.log("data mila hain" + productsdata);
    res.status(201).json(productsdata);
 } catch (error) {
       console.log("error" + error.message);
   }
});

//get individual data


router.get("/getproductsone/:id", async (req, res) => {

   try {
       const { id } = req.params;
       //console.log(id);

     const individualdata = await Products.findOne({ id: id });
   console.log(individualdata + "individual data hai");

       res.status(201).json(individualdata);
   } catch (error) {
      res.status(400).json(error);
      console.log("error" + error.message);
   }
});




//user schema
//register data
//http post request
router.post("/register",async(req,res)=>{
   
   // console.log(req.body);

   const {fname,email,mobile,password,cpassword} = req.body;

   if(!fname || !email || !mobile || !password || !cpassword){
      res.status(422).json({error:"fill all the data"});
      console.log("No data available");
   }

try{
   //if already data in database
const preuser = await SIGNUPDATA.findOne({email:email});
//if true return that is user already in db
if(preuser){
   res.status(422).json({error:"This user is already present"});
}
else if(password !== cpassword){
   res.status(422).json({error:"both passwords not matching"});
}
else{
   const finalUser = new SIGNUPDATA(
      {fname,email,mobile,password,cpassword}
   );
//mongodb method to save user details
   const storedata = await finalUser.save();
   console.log(storedata);
   res.status(201).json(storedata);

}
}
catch(error){
   console.log("Error during registration time" + error.message);
   res.status(422).send(error);
}

});

//login user api
// router.post("/login",async(req,res)=>{
//    const {email,password} = req.body;
// // checking valid user through email
//    if(!email || !password){
//       res.status(400).json({error:"Fill all the data"})
//    };
//    try{
//       const userlogin = await SIGNUPDATA.findOne({email:email});
//       // console.log(userlogin);

//       // checking valid user through password

//       if(userlogin){
//          //password comparison with db password
//          const isMatch = await bcrypt.compare(password,userlogin.password);
//          console.log(isMatch);
//          if(!isMatch){
//             res.status(400).json({error:"Password is not matching"})
//          }
//          else{
//             res.status(201).json({message:"Success : Password matched"})
//          }
//       }
//    }
//    catch(error){
//       res.status(400).json({error:"Invalid details"})

//    }

// })

router.post("/login",async(req,res)=>{
   const {email,password} = req.body;
    
   if(!email || !password){
      res.status(400).json({error:"Fill all data"})
   };
try{
const userlogin = await SIGNUPDATA.findOne({email:email});
console.log(userlogin + "CLEELA USER");
if(userlogin){
   const isMatch = await bcrypt.compare(password,userlogin.password);
   // console.log(isMatch);

//TOKEN GENERATE
   const token = await userlogin.generateAuthToken();
   // console.log(token);

   //COOKIE GENERATE
   //cookie name is Amazonweb and it expire in 15 minutes

   res.cookie("Amazonclon", token, {
      expires: new Date(Date.now() + 2589000),
      httpOnly: true
  });
//   console.log(`This is a cookie ${req.cookies.Amazonclon}`);


   if(!isMatch){
      res.status(400).json({error:"PW NOT MATCHING"})
   }
   else{
     
      //sending user details to front end on console
      res.status(201).json(userlogin)
   }
}
else{
   res.status(400).json({error:"invalid details"});
}
}
catch(error){
   res.status(400).json({error:"invalid details catch"});
}

})

//ADDING DATA INTO THE CART
//API CALLING

router.post("/addcart/:id",athenticate,async(req,res)=>{
   try{
const {id} = req.params;
const cart = await Products.findOne({id:id});
console.log(cart +"cart value");
//finding user by middle-ware
const UserContact = await SIGNUPDATA.findOne({_id:req.userID});
console.log(UserContact);


if(UserContact){
   const cartData = await UserContact.addcartdata(cart);
   await UserContact.save();
   console.log( cartData);
   res.status(201).json(UserContact);
}
else{
   res.status(401).json({error:"Invalid user"});
}

   }
   catch(error){
      res.status(401).json({error:"Invalid user"});

   }
})

//GET CART DETAILS

router.get("/cartdetails",athenticate,async(req,res)=>{
   try{
      const buyuser = await SIGNUPDATA.findOne({_id:req.userID});
      res.status(201).json(buyuser);
   }
   catch(error){
      console.log("error" + error)
   }
})

// GET VALID USER

router.get("/validuser",athenticate,async(req,res)=>{
   try{
      const validuserone = await SIGNUPDATA.findOne({_id:req.userID});
      res.status(201).json(validuserone);
   }
   catch(error){
      console.log("error" + error)
   }
})


//REMOVE ITEM FROM CART
router.delete("/remove/:id",athenticate, async (req, res) => {
   try {
       const { id } = req.params;

       req.rootUser.carts = req.rootUser.carts.filter((curel) => {
           return curel.id != id
       });

       req.rootUser.save();
       res.status(201).json(req.rootUser);
       console.log("iteam removed");

   } catch (error) {
       console.log(error + "jwt provide then remove");
       res.status(400).json(req.rootUser);
   }
});


// for userlogout

router.get("/logout",athenticate, async (req, res) => {
   try {
      //here we remove  the token and cookie for logout process onclick of logout button
      //applied filter method on array of tokens previously generated
       req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
           return curelem.token !== req.token
       });
//After clearing cookie i.e logout , user will redirect o home page : "/""
       res.clearCookie("Amazonclon", { path: "/" });
       req.rootUser.save();
       res.status(201).json(req.rootUser.tokens);
       console.log("user logout");

   } catch (error) {
       console.log(error + "jwt provide then logout");
   }
});

module.exports = router;