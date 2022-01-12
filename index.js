const express = require('express');
const port = 8000;
const app = express();
const db = require('./config/mongoose');

app.set('view engine','ejs');      //set up the view engine
app.set('views','./views');        // specify a folder to look for the views.
app.use(express.urlencoded());     // so that we can collect form data and store it in req.body 
app.use(express.static('assets')); // to access static files

//Use Express Router
app.use('/',require('./routes/index'));

app.listen(port,function(err){
   if(err){
       console.log('Error in starting the server ',err);
       return;
   }
   else{
       console.log('The server is running successfully at port no ',port);
   }
});