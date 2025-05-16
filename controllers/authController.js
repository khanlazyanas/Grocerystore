import  {User}  from "../models/Usermodel.js";
import bcrypt from "bcryptjs";
import  {sendCookie}  from "../utils/sendcookie.js";


export const Register = async(req,res)=>{
   try {
    const {name,email,password} = req.body;

    const existuser = await User.findOne({email})

    if(existuser){
        return res.status(400).json({success:false,message:"User Allready exists"})
    }

    const hassedpassword = await bcrypt.hash(password,10)

    const user = await User.create({name,email,password:hassedpassword})
    sendCookie(user,res, `Register successfully`)
   } catch (error) {
    res.status(500).json({message:"Server error"})
   }
};



export const Login = async(req,res)=>{
  try {
    const {email,password} = req.body;
    const user = await User.findOne({email})

    if(!user){
      return res.status(400).json({message: "Invalid Credentials"})
    }

    const ismatch = await bcrypt.compare(password,user.password)

    if(!ismatch){
      return res.status(400).json({message: "Invalid Credentials"})
    }

    sendCookie(user,res, `welcome back ${user.name}`);

  } catch (error) {
    res.status(500).json({success:false, message:"Login error"})
  }
}

export const Logout = (req, res) => {
res.clearCookie("token", {
  httpOnly: true,
  sameSite: "None",
  secure: true,
  domain: "grocerystore-6wnc.onrender.com",
  path: "/",
});



  res.status(200).json({ success: true, message: "Logged out successfully" });
};



