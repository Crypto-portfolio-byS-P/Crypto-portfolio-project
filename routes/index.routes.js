const express = require('express');
const router = express.Router();
const axios = require('axios')

/* GET home page */
router.get("/", (req, res, next) => {

  //Getting requested coins from API(coins manually enered in documentation)


//   axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=bitcoin%2C%20ethereum%2C%20tether%2C%20binancecoin%2C%20usd-coin%2C%20cardano%2C%20dogecoin%2C%20matic-network%2C%20solana&order=market_cap_desc&per_page=100&page=1&sparkline=false")
// .then(requestedCoinsFromApi => { 
//   console.log(requestedCoinsFromApi)
//   res.render("index", {coins: requestedCoinsFromApi});
// })
// .catch(e => {
//   console.log("error creating new book", e);
//   next(e);
// });

//Getting top 7 trending coins in last 24h

// axios.get("https://api.coingecko.com/api/v3/search/trending")
// .then(trendingCoins => { 
//   console.log(trendingCoins.data.coins)
//   // res.render("index", {coin: trendingCoins.data.coins});
// })
// .catch(e => {
//   console.log("error creating new book", e);
//   next(e);
// });
  
const p1 = axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=bitcoin%2C%20ethereum%2C%20tether%2C%20binancecoin%2C%20usd-coin%2C%20cardano%2C%20dogecoin%2C%20matic-network%2C%20solana&order=market_cap_desc&per_page=100&page=1&sparkline=false");
const p2 = axios.get("https://api.coingecko.com/api/v3/search/trending");

Promise.all([p1, p2])
.then(values =>{

  // const top_coins = {
  //   coins: values[0].data
  // }
  // const trendingCoins = {
  //   trending : values[0].data.coins
  // }

  // console.log(values)

  res.render("index", {values});
})
.catch(e => {
    console.log("error creating new book", e);
    next(e);
  });

});

module.exports = router;
