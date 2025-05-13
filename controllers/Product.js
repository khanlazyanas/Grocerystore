import { Product } from "../models/Product.js";

export const getAllProduct = async(req,res,next)=>{
    try {
        const product = await Product.find()
        res.json({
            success:true,
            product,
        })
    } catch (error) {
        next(error)
    }
}