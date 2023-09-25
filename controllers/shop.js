const axios = require("axios"); //library for http req
//return the rate of dollar.
//{
//  "rate": 3.75162
//}


const index = async(req, res) => {
    //Example: use this as an insparation
    // const products = await Product.find({})
    try {
        // // Retrieve the API key for Open Exchange Rates from environment variables
        // const apiKey = process.env.OPENEXCHANGERATES_API_KEY;
        // // Define the base currency as USD (US Dollar) and target currency as ILS (Israeli Shekel)
        // const baseCurrency = "USD";
        // const targetCurrency = "ILS";
        // // Construct the API URL for retrieving the latest exchange rates
        // const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&base=${baseCurrency}`;
        // // Send a GET request to the Open Exchange Rates API using Axios
        // const response = await axios.get(apiUrl);
        // const exchangeRates = response.data.rates;
        // // Retrieve the exchange rate from USD to ILS
        // const usdToIlsRate = exchangeRates[targetCurrency];
        res.render("../views/shop.ejs", {username: req.session.user?.username, rate: 3.5}); // rate: usdToIlsRate
    } catch (error) {
        res.status(500).json({ message: "Error fetching exchange rate" });
    }
}

module.exports =  {
    index
};