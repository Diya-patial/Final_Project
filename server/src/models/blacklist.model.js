const mongoose =require("mongoose")
const blackilistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        require:[true,"token is required to be added in blacklist"]
    }},
    {
        timestamps:true
    }
)
const tokenBlacklistModel=mongoose.model("blacklistTokens",blackilistTokenSchema)
module.exports=tokenBlacklistModel