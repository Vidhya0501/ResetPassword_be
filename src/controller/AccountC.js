import AccountModel from "../models/AccountM.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

//register - post
const register=async(req,res)=>{
    try {
        let account= await  AccountModel.create(req.body)
        if(account){
            res.send(account)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
   
}


//login - post
const login=async(req,res)=>{
    try {
        const {email,password}=req.body
        let user = await AccountModel.findOne({email:email})
        if(user){
            if(user.password===password){
                res.send("Login successful")
            }
            else{
                res.send("Incorrect Password")
            }
        }
        else{
            res.json("Not yet registered")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const forgotPassword=async (req,res)=>{
    try {
        const {email}=req.body
        let user = await AccountModel.findOne({email:email})
        if(!user){
            return res.send({Status:"User not exist"})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
            
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'vidhyasuri97@gmail.com',
                  pass: 'Vidhyaviji'
                }
              });
              
              var mailOptions = {
                from: 'vidhyasuri97@gmail.com',
                to: 'kmusvidhya@gmail.com',
                subject: "Reset your password",
                text: `http://localhost:5173/reset-password/${user._id}/${token}`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  return res.send({Status:"Success"})
                }
              });
            
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const resetPassword = async (req,res)=>{
    try {
        const {id,token}=req.params
        const {password}=req.body
    
        await jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.send({Status:"Error in token"})
            }
            else{
                let hash= bcrypt.hash(password,process.env.SALT_ROUNDS)
                if(hash){
                    AccountModel.findByIdAndUpdate({_id:id},{password:hash})
                    res.send({Status:"Success"})
                }
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
   
}
export default{
    register,
    login,
    forgotPassword,
    resetPassword
}