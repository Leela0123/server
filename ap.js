require("dotenv").config();
const express = require("express");
const ap = express();
const mongoose = require('mongoose');
require("./db/conn");
const  Products = require("./models/productsSchema");
const DefaultData = require("./defaultdata");
const cors = require("cors");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");


// middleware
ap.use(express.json());
ap.use(cookieParser(""));
ap.use(cors());
ap.use(router);

// const port = process.env.PORT || 8005;
 const port = 8005;

ap.listen(port,()=>{
    console.log(`your server is running on port ${port} `);
});

DefaultData();