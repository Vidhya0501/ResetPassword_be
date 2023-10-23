import AccountModel from "../models/AccountM.js"
import Auth from '../common/Auth.js'
import nodemailer from 'nodemailer'

//register - post
const register=async(req,res)=>{
    try {
        let user = await AccountModel.findOne({email:req.body.email})
        if(!user){
            req.body.password = await Auth.hashPassword(req.body.password)
            await AccountModel.create(req.body)
            res.status(201).send({
                message:"User registered Successfully"
             })
        }
        else
        {
            res.status(400).send({message:`User with ${req.body.email} already exists`})
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
   
}


//login - post
const login=async(req,res)=>{
    try {
        let user = await AccountModel.findOne({email:req.body.email})
        if(user)
        {
            let hashCompare = await Auth.hashCompare(req.body.password,user.password)
            if(hashCompare)
            {
                let token = await Auth.createToken({
                    id:user._id,
                    name:user.name,
                    email:user.email
                    // role:user.role
                })
                res.status(200).send({
                    message:"Login Successfull",
                    token
                })
            }
            else
            {
                res.status(400).send({
                    message:`Invalid Password`
                })
            }
        }
        else
        {
            res.status(400).send({
                message:`Account with ${req.body.email} does not exists!`
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const forgotPassword=async (req,res)=>{
    try {
        const {email}=req.body;
        let user = await AccountModel.findOne({email:email})
        if(!user){
            return res.send({Status:"User not exist"})
        }
     
        let token = await Auth.createToken({
            id:user._id,

        })
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'vidhyasuri97@gmail.com',
                  pass: 'llit sffw uqgd dycl'
                }
              });
              
              var mailOptions = {
                from: 'vidhyasuri97@gmail.com',
                to: 'vidhyasuri97@gmail.com',
                subject: "Reset your password",
                text: `http://localhost:5173/reset-password/${user._id}/${token}`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  return res.send({
                    Status:"Success",
                    token 
                })
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

const resetPassword=(req,res)=>{
        const {id,token}=req.params
        const {password}=req.body
            
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.json({Status:"Error with token"})
            } else{
                bcrypt.hash(password,process.env.SALT_ROUNDS)
                .then(hash=>{
                    AccountModel.findByIdAndUpdate({_id:id},{password:hash})
                    .then(u=>res.send({Status:"Success"}))
                    .catch(err=>res.send({Status:err}))
                })
                .catch(err=>res.send({Status:err}))
            }
        })
    
}
export default{
    register,
    login,
    forgotPassword,
    resetPassword
}