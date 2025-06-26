const axios = require('axios');
require('dotenv').config();

const createVisaPayment = async (amount, cardDetails) => {
    const apiKey = process.env.VISA_API_KEY;

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    };

    const body = {
        // Visa Direct API parameters (e.g., account info, transaction amount, etc.)
        amount: amount,
        card: cardDetails,
    };

    try {
        const response = await axios.post('https://api.visa.com/v1/payment', body, { headers });
        return response.data;
    } catch (error) {
        console.error("Visa Payment Error: ", error);
        throw error;
    }
};
