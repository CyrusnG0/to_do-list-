const express = require('express');
const authRoute = require('./route/authRoute')
const mainRoute = require('./route/mainRoute')
const mongoose = require('mongoose');
const cookierParser = require('cookie-parser')


const app = express();
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.static('public'));
app.use(cookierParser()); 

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
app.use(mainRoute);

app.use('/home', (req,res)=>{
    res.render('home');
})



app.use((req,res)=>{
    res.status(404).render('404');
})