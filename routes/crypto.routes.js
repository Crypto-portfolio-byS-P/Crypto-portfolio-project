const express = require('express');
const router = express.Router();
const Coin = require('../models/Coin.model');
const mongoose = require("mongoose");

router.get("/charts",  (req, res) => {
    // res.render("views/index");
    res.render("charts")
  });

  router.get("/portfolio", (req, res) => {
    res.render("portfolio/portfolio");
  });


// Add to portfolio: Display form

router.post('/portfolio', (req, res, next) => {

  console.log(req.body)
  const coin = {
   name: req.body.coinName,
   owned: req.body.amount,
   coinId: req.body.coinId
  }

  Coin.create(coin)
  .then(coinInfoFromDb =>{
    console.log(coinInfoFromDb)
    res.send("Coin Created")
  })
})

module.exports = router;