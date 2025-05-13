import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    category:String,
    rating:Number
});

export const Product = mongoose.model("Product",ProductSchema)



