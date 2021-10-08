const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const userRoute = require('./routers/users');
const authRoute = require('./routers/auth');
const passport = require('passport');

dotenv.config();
const app = express();


mongoose.connect(process.env.MONGO_URI ,{useUnifiedTopology:true,useNewUrlParser:true} ).then(() => {
    console.log("connected to mongo...")}).catch(err => {
    console.log(err);
});
app.use(cors());
//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('bucket'))

app.use(helmet());
app.use(morgan('common'));



app.use(passport.initialize());



app.get("/",(req,res,next) => {
    res.send({msg: "welcome to home page"});
});

//routes
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);

app.listen(3000, () => {
    console.log("server is listenning");
});