const express = require('express');
const authRoute = require('./route/authRoute')
const mongoose = require('mongoose');
const e = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.json())
//database connection
const dbURI = 'mongodb+srv://zeta:zeta1234@nodetuts.rigzm.mongodb.net/todo_list?retryWrites=true&w=majority&appName=nodetuts';
mongoose.connect(dbURI)
.then((result)=>{
    app.listen(3000, () => {
        console.log("the server is listening on port 3000");
    })
})
.catch((err)=>{
    console.log(err);
})




app.use(authRoute);