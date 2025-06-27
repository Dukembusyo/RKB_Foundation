const axios = require('axios');
const qs = require('querystring');
const db = require('../config/config.js');
const crypto = require('crypto');
const { Console } = require('console');
require('dotenv').config();
const {MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_LIPA_NA_MPESA_SHORTCODE, MPESA_LIPA_NA_MPESA_SHORTCODE_PASSWORD, MPESA_LIPA_NA_MPESA_SHORTCODE_LIPA_URL } = process.env;
const API_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const STK_PUSH_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
const STK_PUSH_STATUS = 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'


// Function to get access token from M-Pesa API
const getAccessToken = async () => {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  
    try {
      const response = await axios.get(API_URL, {
        headers: { 'Authorization': `Basic ${auth}` },
      });
      // console.log("Accesssss Token", response.data.access_token);
      return response.data.access_token; // Return the access token
    } catch (error) {
      console.error('Error generating access token:', error);
      throw new Error('Failed to generate access token');
    }
  };


// Function to initiate STK Push payment
const initiateMpesaPayment = async (amount, phoneNumber) => {
    const accessToken = await getAccessToken();
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };
    const short_code = process.env.MPESA_SHORTCODE;
 const pass_key = process.env.MPESA_PASSKEY;

 
  function getTimestamp() {
    const now = new Date();

    // If you need to convert to a specific timezone, do it here
    // Example for East Africa Time (UTC+3)
    const eastAfricaTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));

    const year = eastAfricaTime.getUTCFullYear();
    const month = String(eastAfricaTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(eastAfricaTime.getUTCDate()).padStart(2, '0');
    const hours = String(eastAfricaTime.getUTCHours()).padStart(2, '0');
    const minutes = String(eastAfricaTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(eastAfricaTime.getUTCSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

  const password = Buffer.from(`${short_code}${pass_key}${getTimestamp()}`).toString('base64');
 
    // Prepare the payload for STK Push
   
    const payload = {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp:getTimestamp(),
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: "https://webhook.site/08288966-1941-41bf-95a7-a80f2810b32f",
        // CallBackURL: "https://9d4c-197-248-69-203.ngrok-free.app/rkb/mpesa_callback",
        AccountReference: "RKBFOUND",
        TransactionDesc: "Payment of X", 
    };

    try {
        const response = await axios.post(`${STK_PUSH_URL}`, payload, { headers });
        
      //   if(response){

        const transaction_type = 'MPESA';
        const [transactions] = await db.query(`insert into transactions(transaction_type, phone_number, amount, MerchantRequestID, CheckoutRequestID, ResponseCode, ResponseDescription) values(?, ?, ?, ?, ?, ?, ? )`,
        [transaction_type, phoneNumber, amount, response.data.MerchantRequestID, response.data.CheckoutRequestID, response.data.ResponseCode, response.data.ResponseDescription]
        );
      // }
      triggerCallbackManually(response.data);
        return response.data;
    } catch (error) {
        console.error("M-Pesa Payment Error: ", error);
        throw error;
    }
};


// Function to manually trigger the callback after receiving the STK push response
const triggerCallbackManually = async (responseData) => {
  try {
  setTimeout(async () => {

  const accessToken = await getAccessToken();
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
};

  const short_code = process.env.MPESA_SHORTCODE;
  const pass_key = process.env.MPESA_PASSKEY;

  function getTimestamp() {
    const now = new Date();

    // If you need to convert to a specific timezone, do it here
    // Example for East Africa Time (UTC+3)
    const eastAfricaTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));

    const year = eastAfricaTime.getUTCFullYear();
    const month = String(eastAfricaTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(eastAfricaTime.getUTCDate()).padStart(2, '0');
    const hours = String(eastAfricaTime.getUTCHours()).padStart(2, '0');
    const minutes = String(eastAfricaTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(eastAfricaTime.getUTCSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

  const password = Buffer.from(`${short_code}${pass_key}${getTimestamp()}`).toString('base64');
  // Construct the callback payload with the required fields
  const callbackPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: getTimestamp(),
      CheckoutRequestID: responseData.CheckoutRequestID  // Use CheckoutRequestID from the response
  };

  // Simulate sending the callback data to the callback URL
  try {
    
      const callbackResponse = await axios.post(`${STK_PUSH_STATUS}`, callbackPayload, {headers});

      // console.log('Callback successfully triggered:', callbackResponse.data);

      const statusConfirmed = true;
      const statusFailed = false;

      if(callbackResponse.data.ResultCode === '0' ){
        const [callbackUpdates] = await db.query(`update transactions set status = 1, ResultCode = ?, ResultDesc = ? where CheckoutRequestID = ?`,
        [callbackResponse.data.ResultCode, callbackResponse.data.ResultDesc, callbackResponse.data.CheckoutRequestID]); 
      }else if(callbackResponse.data.ResultCode === '1032' || callbackResponse.data.ResultCode === '2001' || callbackResponse.data.ResultCode === '1037'){
        const [callbackUpdates] = await db.query(`update transactions set status = 0, ResultCode = ?, ResultDesc = ? where CheckoutRequestID = ?`,
        [callbackResponse.data.ResultCode, callbackResponse.data.ResultDesc, callbackResponse.data.CheckoutRequestID]); 
      }

     
  } catch (error) {
      console.error('Error triggering callback:', error);
  }
}, 20000); // Delay for 10 seconds (adjust as needed)
} catch(error){
  console.error('Error triggering callback manually:', error);
}
};



module.exports = { getAccessToken, initiateMpesaPayment, triggerCallbackManually };
