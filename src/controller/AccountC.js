import AccountModel from "../models/AccountM.js"

//register - post
const register=(req,res)=>{
    AccountModel.create(req.body)
    .then(accounts=>res.json(accounts))
    .catch(err=>res.json(err))
}

export default{
    register
}