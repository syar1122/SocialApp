const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport_jwt');
require("dotenv").config();

//Register

router.post("/signup",async (req, res, next) => {

    console.log(req.body);

    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);
    
        const user = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPass,
        });

        user.save().then((user) => {
            const _id = user._id;
            const expiresIn = '1d';

        const token ="Bearer " + jwt.sign({sub:_id,iat: Date.now()}, process.env.JWT_SECRET,{expiresIn:expiresIn,algorithm:'HS256'});
                res.status(200).json({msg: "user saved", user: user, token:token, expiresIn:expiresIn});    
        }).catch(err => {
            console.log(err)
        })
        
    }catch(err){
        console.log("USer Error"+err);
    }
});

//SignIn

router.post("/signin", (req, res, next) => {
    User.findOne({username:req.body.username}).then( async (user) => {
        if(!user){
            res.status(401).json({success:false,msg:"could not find user"});

        }
        const isValid = await bcrypt.compare(req.body.password,user.password)
        if(isValid){
            const _id = user._id;
            const expiresIn='1d';
            const token ="Bearer " + jwt.sign({sub:_id,iat: Date.now()}, process.env.JWT_SECRET,{expiresIn:expiresIn,algorithm:'HS256'});
            res.status(200).json({success:true, user:user, token: token, expiresIn:'1d'})
        }else{
            res.status(401).json({success:false, msg:"wrong password"})
        }
    }).catch(err => {
        res.status(500).json({msg:"bad request" + err})
    })
});





module.exports = router;