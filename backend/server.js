const express = require('express');
require('dotenv').config();
const cookie_parser = require('cookie-parser');

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL;

const app = express();

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.use(cookie_parser());   
app.use(morgan('dev'));   // HTTP request logging

// routes


app.listen(PORT, ()=>{
    console.log(`server listening on port: ${PORT} `);
})