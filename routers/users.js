const router = require('express').Router();
const passport = require('passport');
const User = require("../models/user");
const imgExt = require("../config/image-extract");
require('../config/passport_jwt');

router.get("/",(req, res, next) => {
    res.send("welcome to user route");
});

router.get("/my-profile",passport.authenticate("jwt",{session:false}),(req, res, next) => {
    console.log("req.user",req.user)
    res.status(200).send({profile:req.user});
})

router.put("/update-profile" ,passport.authenticate("jwt",{session:false}),imgExt  ,(req,res,next) => {
    
    let {user, body, file} = req;
    console.log("file --------", file);
    
    let updatedUser = {...body, "profilePicture":file?.path}
    
    console.log("updated user --------", updatedUser);
    
    User.findByIdAndUpdate({_id: user._id }, updatedUser,(err, resUser) => {
        if(err){
            res.status(500).json({"message" : "server error" + err});
        }
        res.status(200).json({"message" : "updated" ,"user": resUser});
    })
    
    
})

module.exports = router;