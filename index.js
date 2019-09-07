const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport = require('passport');
const app = express();

//bring all routes
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const questions = require('./routes/api/questions');

//middleware for bodyparser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//mongodb config

const {mongoURL} = require('./setup/myurl');

//attemp to connect to database

mongoose
    .connect(mongoURL,{ useNewUrlParser: true })
    .then(()=> console.log('MongoDB connected successfully'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());


//config for JWT strategy
require('./Strategy/jsonwtstrategy')(passport)

//just for testing route
// app.get('/',(req,res)=>{
//     res.send('hello world');
// });

//actual routes
app.use('/api/auth',auth);
app.use('/api/profile',profile);
app.use('/api/questions',questions);

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(`App is running at ${port}`));