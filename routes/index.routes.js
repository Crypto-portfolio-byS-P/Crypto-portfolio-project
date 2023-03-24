const express = require('express');
const router = express.Router();
const axios = require('axios')

/* GET home page */
router.get("/", (req, res, next) => {

  axios.get("https://api.coingecko.com/api/v3/coins/list?include_platform=false")
.then(responseFromApi => { 
  console.log(responseFromApi)
  res.render("index", {data: responseFromApi});
})
.catch(e => {
  console.log("error creating new book", e);
  next(e);
});
  
});

module.exports = router;
