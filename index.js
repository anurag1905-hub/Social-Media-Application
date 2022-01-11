const express = require('express');
const port = 8000;
const app = express();

//Use Express Router
app.use('/',require('./routes/index'));

app.set('view engine','ejs');
app.set('views','./views');


app.listen(port,function(err){
   if(err){
       console.log('Error in starting the server ',err);
       return;
   }
   else{
       console.log('The server is running successfully at port no ',port);
   }
});