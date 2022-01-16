const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts_controller');
console.log('Reached');
router.post('/create',postsController.create);

module.exports = router;