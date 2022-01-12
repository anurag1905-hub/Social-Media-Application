//Render the login page
module.exports.login = function(req,res){
    return res.render('login');
} 

//Render the Signup Page
module.exports.signup = function(req,res){
    return res.render('signup');
}

//get the sign up data
module.exports.create = function(req,res){
    // To Do Later
}

//sign in and create a session for the user.
module.exports.createSession = function(req,res){
    // To Do Later
}


