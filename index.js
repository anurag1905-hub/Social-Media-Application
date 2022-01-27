const express = require('express');
const cookieParser = require('cookie-parser');  // Allows us to read and write to a cookie
const port = 8000;
const app = express();
const db = require('./config/mongoose');
const session = require('express-session'); // to create session cookie and store user information in cookies in an encrypted form.
const passport = require('passport');  // passport uses session-cookies to store the identity of the authenticated user.
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongodb-session')(session);  // Used for storing cookies, otherwies cookies get deleted as soon as server restarts due to limited storage.
const sassMiddleware = require('node-sass-middleware');   // Used to convert sass files to css.
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,         // whatever information we see in the terminal. It helps in debugging
    outputStyle:'extended', // use multiple lines
    prefix:'/css'       // place where server should look for css files
}));

app.use(express.urlencoded());     // so that we can collect form data and store it in req.body 
app.use(express.static('assets')); // to access static files
app.use(cookieParser());           // set up the cookie parser

app.set('view engine','ejs');      //set up the view engine
app.set('views','./views');        // specify a folder to look for the views.

// express session is used to store user id in cookies in an encrypted form.
//mongo store is used to store the session cookie in the db
app.use(session({
    name:'socilaMediaApplication',
    // TODO: change the secret before deployment in production mode
    secret:'webDevelopment',
    saveUninitialized:false,  //When user is not logged in, don't store extra info in session cookie.
    resave:false,    // Don't save the user's info in session cookie if it has not been changed.
    cookie:{
        maxAge: (1000*60*100)
    },
    store: new MongoStore(
        {
            mongooseConnection:db,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
// We should use it after session is used because it uses session cookies. Flash message is stored in cookies which store session information.
app.use(flash());
app.use(customMware.setFlash);

//Use Express Router
app.use('/',require('./routes/index'));

//Make the uploads path available to the browser.
app.use('/uploads',express.static(__dirname+'/uploads'));

app.listen(port,function(err){
   if(err){
       console.log('Error in starting the server ',err);
       return;
   }
   else{
       console.log('The server is running successfully at port no ',port);
   }
});