const axios = require('axios');
require('dotenv').config();

const createPayPalPayment = async (amount) => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;

    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

    const headers = {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
    };

    const body = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        transactions: [{
            amount: {
                total: amount,
                currency: 'USD'
            },
            description: 'Donation for a cause'
        }],
        redirect_urls: {
            return_url: 'https://your-website.com/return',
            cancel_url: 'https://your-website.com/cancel'
        }
    };

    try {
        const response = await axios.post('https://api.sandbox.paypal.com/v1/payments/payment', body, { headers });
        return response.data;
    } catch (error) {
        console.error("PayPal Payment Error: ", error);
        throw error;
    }
};
