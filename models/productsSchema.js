
const mongoose = require('mongoose');

// Defining Schema
const productsSchema = new mongoose.Schema({
    id:String,
    url:String,
    detailsUrl :String,
    title:Object,
    price:Object,
    description:String,
    discount:String,
    tagline:String
});

// Defining models
const Products = new mongoose.model("users",productsSchema);
module.exports = Products;