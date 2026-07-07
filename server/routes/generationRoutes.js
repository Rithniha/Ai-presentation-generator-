const express = require('express');
const { generatePresentationOutline, rewriteSlideNode } = require('../controllers/generationController');

const router = express.Router();

router.post('/outline', generatePresentationOutline);
router.post('/rewrite', rewriteSlideNode);

module.exports = router;
