//Render the home page 
module.exports.home = function(req,res){
    console.log(req.cookies);
    res.cookie('user_id',34);
    return res.end('<h1>THis is the home page</h1>');
}