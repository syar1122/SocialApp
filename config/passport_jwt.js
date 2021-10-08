const passport = require('passport');
const PassportJwt = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
require("dotenv").config();

// passport jwt options

// jwtFromRequest : PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_SECRET,
//     issuer:'issuer',
//     audience:'audience',
//     algorithms: ['RS256'],
//     ignoreExpiration: false,
//     jsonWebTokenOptions: {
//         complete:false,
//         clockTolerance: '',
//         maxAge: '2d',
//         clockTimestamp: '100',
//         nonce: 'openId'
//     },


const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256']
}

const strategy = new PassportJwt(options,(payload,done) => {
    User.findOne({_id: payload.sub}).then((user) => {
        if(!user){
            done(null,false);
        }else{
        done(null,user)}
    }).catch((err) => {
        done("strategy "+err,false);
    })
});

passport.use(strategy);