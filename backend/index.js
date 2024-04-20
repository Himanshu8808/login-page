require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const mongoURI = process.env.MONGO_URL;
const port = process.env.PORT ;

mongoose.connect(mongoURI);

app.get('/',(req,res)=>{
    res.send("hello world");
})
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth.js'));

app.listen(port, () => {
    console.log('Server is running on port', port)
  })