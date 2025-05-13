import jwt from "jsonwebtoken"


export const Sendcookie =(user,res,message)=>{

    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"10d"});

    res.cookie("token",token,{
        httpOnly:true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
        sameSite:"lax",
        secure:process.env.NODE_ENV === "production" ? true :  false
    })

    res.status(200).json({
        success:true,
        message,
        user,
        token,
    })
}





