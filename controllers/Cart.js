import { Cart } from "../models/Cartmodel.js";

// 🛒 Get Cart
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId });
  res.json(cart || { items: [] });
};

// 🛒 Add to Cart
export const addtoCart = async (req, res, next) => {
  try {
    const { productId, name, price, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = new Cart({ userId: req.userId });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        name,
        price,
        quantity: Number(quantity),
      });
    }

    cart.total = cart.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// 🛒 Update Item Quantity
export const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart item quantity updated",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// 🛒 Remove from Cart
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
