const userModel=require("../models/user.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
 const tokenBlacklistModel=require("../models/blacklist.model")

// @route POST /api/auth.registerConroller
// @description Register new user
// @access public

const registerController=async(req,res)=>{
      const {username,email,password}=req.body
      if(!username || !email || !password){
        return res.status(400).send({
            success:false,
            message:"All field are required"
        })
      }
      const isUserAlreadyExists=await userModel.findOne({
        $or:[{username},{email}]
      })
      if(isUserAlreadyExists){
        return res.status(400).json({
            message:"Account already exists with this email address or username"
        })
      }
      const hash=await bcrypt.hash(password,10);
      const user=await userModel.create({
        username,
        email,
        password:hash
      })
      const token=jwt.sign({
        id:user._id,username:user.username
      },process.env.JWT_SECRET,{
        expiresIn:"1d"
      }
    )
    res.cookie("token",token)
    res.status(201).json({
        message:"user registered succesfully",
        user:{
      id:user._id,
      username:user.username,
      email:user.email
        }
    })
}
const loginController=async(req,res)=>{
    const{email,password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }
    const isPasswordValid=await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }
      const token=jwt.sign({
        id:user._id,username:user.username
      },process.env.JWT_SECRET,{
        expiresIn:"1d"
      }
    )
    res.cookie("token",token)
    res.status(200).json({
        message:"user loggedIn succesfully",
        user:{
      id:user._id,
      username:user.username,
      email:user.email
        }
    })

}
const logoutController=async(req,res)=>{
  const token=req.cookies.token
  if(token){
     await tokenBlacklistModel.create({token})
  }
  res.clearCookie("token")
  res.status(200).json({
    message:"user logged out succesfully"
  })
}
const getmeController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id)
    
    if (!user) return res.status(404).json({ message: "User not found" }) // ✅ add this
    
    res.status(200).json({ user: { id: user._id, username: user.username, email: user.email }})
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}
module.exports={registerController,loginController,logoutController,getmeController}