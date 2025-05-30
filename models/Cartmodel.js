// import mongoose from "mongoose";

// const CartSchema = new mongoose.Schema({
//     userId:String,
//     items:[
//         {
//             productId:String,
//             name:String,
//             price:Number,
//             quantity:Number,

//         }
//     ]
// });

// export const Cart = mongoose.model("Cart",CartSchema);

import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      // image field removed as requested
    },
  ],
  total: Number,
});

export const Cart = mongoose.model("Cart", CartSchema);
