const express = require('express');
const db = require('../config/config.js');
const router = express.Router();

const path = require('path');

const {initiateMpesaPayment} = require('../controllers/mpesaController')
const axios = require('axios');
// const {League, User} = require('../models');
const app = express();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const crypto = require('crypto');
const { error } = require('console');
require('dotenv').config();


const cron = require("node-cron");
const winston = require("winston");
const { exit } = require('process');
const { match } = require('assert');


// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/');
// }




// Configure Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "cron.log" }),
  ],
});

const validateMobileNumber = (mobileNumber) => {
  // Regex to match mobile numbers starting with 254 and exactly 12 digits without spaces
  const regex = /^254\d{9}$/;

  return regex.test(mobileNumber);
};

// router.use('/download', express.static(path.join(__dirname, '../downloads')));

// Unified donation route
router.post('/donate', async (req, res) => {
    const { amount, phoneNumber, paymentMethod } = req.body;
    // console.log("Req Body", req.body);

    try {
        let response;

        switch (paymentMethod) {
            case 'mpesa':
                response = await initiateMpesaPayment(amount, phoneNumber);
                break;
            case 'paypal':
                response = await createPayPalPayment(amount);
                break;
            case 'visa':
                response = await createVisaPayment(amount, { cardNumber: req.body.cardNumber, expDate: req.body.expDate });
                break;
            // Add cases for Airtel and Equitel
            default:
                return res.status(400).json({ message: 'Invalid payment method' });
        }

        
        res.status(200).json({status: 'success', response, message:'Payment initiated successfully...'});
    } catch (error) {
        res.status(500).json({ error: error.message, message: error.message});
    }
});

router.post('/mpesa_callback', async (req, res) =>{
  const {MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, Amount, PhoneNumber} = req.body;

  console.log("Callback Urlsss", req.body);
  res.status(200).send('Callback processed');
})

router.get('/donate', async (req, res) => {
  res.render('donate');
});

router.get('/contact', async (req, res) => {
  const success = req.query.success === 'true';
  console.log("Succes server", success)
 res.render('contact', {success});
});

router.get('/extra', async (req, res) => {
    res.render('extra');
});

router.get('/index', async (req, res) => {
  res.render('index');
});
  
router.get('/partner', async (req, res) => {  
   res.render('partner');

});

router.get('/dashboard', async (req, res) => {
  const page = parseInt(req.query.feedback) || 1; // current page
  const pag = parseInt(req.query.transactions) || 1;
  const limit = 10; // items per page
  const limits = 10;

  const offset = (page - 1) * limit;
  const offsets = (pag - 1) * limits
  try{

  const feedback = await db.query(`SELECT * FROM contact ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  

  const countResult = await db.query(
    `SELECT COUNT(*) as count FROM contact`);
  const totalItems = countResult[0][0].count;
  const totalPages = Math.ceil(totalItems / limit);
  
  const transactions = await db.query(`SELECT * FROM transactions ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
  [limits, offsets]
);
  const countTransactions = await db.query(
    `SELECT COUNT(*) as count FROM transactions`);
  const totalTransacts = countTransactions[0][0].count
  const totalP = Math.ceil(totalTransacts / limits);


if(feedback && transactions){
  res.render('dashboard', {feedback, transactions, currentPage: page, totalPages, countResult, currentP:pag, totalP, countTransactions});
}
} catch (error){
  console.error("System Error:", error)
  res.status(500).send('Internal Server Error. Check your network connection and retry. If issue persist, contact admin.')
}
  
})
 
router.get('/shop', async (req, res) => {
    res.render('shop');
});

router.post('/contact', async (req, res) => {
  const {name, email, subject, message} = req.body;

  // console.log("Contact body", req.body)
  try {
    const [rows] = await db.query(`insert into contact(name, email, subject, message) values('${name}', '${email}', '${subject}', '${message}')`);
    if(rows.affectedRows > 0){
      // res.status(200).json({message:'Your submission has been received'});

      // const success = req.query.success === 'true';
      res.redirect('contact?success=true');
    }
    else{
      res.redirect('contact?success=false');
    }
  } catch (err) {
    console.error('Database error:', err);
    // res.status(500).send('Internal Server Error');
    res.redirect('contact?success=false');
    
  }
});




module.exports = router;