const mongoose = require('mongoose');
const DB = process.env.DATABASE;
mongoose.connect(DB).then(()=>console.log("Database connection is successfully done")).catch((error)=>console.log("error hai" + error.message))
