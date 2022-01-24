const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
    return res.redirect('This should be landing Page.');
}