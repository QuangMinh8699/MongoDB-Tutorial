const express = require('express');
const app = express();
const port = 3000;
const authRouter = require('./router/auth');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017', (err) => {
    if (!err) console.log('db connected');
    else console.log('db error');
})

app.use(express.json())

app.use('/api/auth', authRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})