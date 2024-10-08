const express = require('express');
require('dotenv').config();


const PORT = process.env.PORT || 4000;

const app = express();

// middlewares

app.use(express.json());  // To parse JSON bodies
app.use(morgan('dev'));   // HTTP request logging

// routes


app.listen(PORT, ()=>{
    console.log(`server listening on port: ${PORT} `);
})