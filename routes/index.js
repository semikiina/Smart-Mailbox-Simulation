const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/users', mailController.getAllMail);

module.exports = router;
