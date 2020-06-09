const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors');

const app = express();

mongoose.connect("mongodb://localhost:27017/mevn", { useNewUrlParser: true })
    .then(db => console.log('[Server] Connected to db!'.bgBrightGreen.black + '✌'))
    .catch(error => console.log('[Server] Error!'.red,error));
//Settings
app.set('port', process.env.PORT || 3000);


//Middlewares
app.use(express.json());
//static files
app.use(express.static(__dirname + '/public'));

//routes
app.use('/api/tasks',require('./routes/tasks'))

app.listen(app.get('port'), ()=>{
    console.log("[Server] Server ready at port ".bgBrightYellow.black+app.get('port'));
})