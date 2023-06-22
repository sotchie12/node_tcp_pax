const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const config = require('../config/config.json');
const controller = require('../server_modules/controller');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Rest API routes
router.get('/', controller.baseTest);
router.get('/enquiry', controller.enquiryReceived);

router.post('/sale', controller.saleReceived);
router.post('/settle', controller.settleReceived);


module.exports = router;