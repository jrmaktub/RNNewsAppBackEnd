const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute')

//process.env object is a global Node object, and variables are passed as strings
//importing .env file
require('dotenv').config();
require('colors');

connectDB();

const app =  express();

//getting the .env constant
//check if the app NODE_ENV is in development
if(process.env.NODE_ENV === 'development')
// morgan acts as an API 
    app.use(morgan('dev'));

//middleware to access the body data
app.use(express.json());
//access the url data
app.use(express.urlencoded({extended: false}));

app.use('/api/users', userRoute)

app.get('*', function (req, res) {
    console.log('Endpoint does not exist.');
    res.status(404).send('Endpoint does not exist.');
});

const PORT = process.env.PORT || 3000;

//always listening.
app.listen(
    PORT,
    console.log(`Server is  connected in ${process.env.NODE_ENV} mode on ${PORT}`.red)
);



