const express = require('express');
const router = express.Router();
const {checkSSL} = require('../../v1/controllers/ssl');

router.post('/check', checkSSL);

module.exports = router;

