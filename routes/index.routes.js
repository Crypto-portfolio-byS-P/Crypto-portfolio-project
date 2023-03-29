const express = require('express');
const router = express.Router();
const axios = require('axios');
// const { response } = require('../app');

async function getData() {
  const data = await Promise.all([
    // axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=20&page=1&sparkline=false"),
    axios.get("https://api.coincap.io/v2/assets"),
    axios.get("https://api.coingecko.com/api/v3/search/trending"),
  ])

  return data.map(response => response.data)
}

/* GET home page */
router.get("/", async (req, res, next) => {

  let p1 = []
  let p2 = []

  // Do I have a last request time?
  if (req.session.lastRequestTime) {
    // I have a last request time, does the time expired?
    if (Date.now() - req.session.lastRequestTime > 1000 * 60 * 60) {

      const responseCall = await getData()

      p1 = responseCall[0]
      p2 = responseCall[1]

      req.session.lastRequestTime = Date.now()
      req.session.p1 = p1
      req.session.p2 = p2

    } else {
      // I have a last request time, we are still on time
      p1 = req.session.p1
      p2 = req.session.p2

      // console.log("i am here1", p1)
    }
  } else {
    // I don't have a last request time
    const responseCall = await getData()

    p1 = responseCall[0]
    p2 = responseCall[1]

    req.session.lastRequestTime = Date.now()
    req.session.p1 = p1
    req.session.p2 = p2

    // console.log("i am here2")
    
  }



  res.render("index", { values: [p1, p2] });


});




module.exports = router;
