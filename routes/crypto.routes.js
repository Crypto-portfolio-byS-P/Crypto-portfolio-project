const express = require('express');
const router = express.Router();
const Coin = require('../models/Coin.model');
const mongoose = require("mongoose");

// let currentUserEmail

router.get("/charts",  (req, res) => {
    // res.render("views/index");
    res.render("charts")
  });

  // router.get("/portfolio", (req, res) => {
  //   res.render("portfolio/portfolio");
  // });


// Add to portfolio: Display form

router.post('/portfolio/add', (req, res, next) => {

  // console.log(req.session.currentUser)

  
  const coin = {
   name: req.body.coinName,
   owned: req.body.amount,
   coinId: req.body.coinId,
   purchasedAt: req.body.purchasedAt,
   addedBy: req.session.currentUser.email,
   image: req.body.image
  }

  Coin.create(coin)
  .then(coinInfoFromDb =>{
    // console.log(coinInfoFromDb)
    res.redirect("/crypto/portfolio")
    res.render("portfolio/portfolio", {coinInfoFromDb})
    
  })
})


router.get('/portfolio', (req, res, next) => {

 
console.log(req.session
  )

  Coin.find({addedBy: req.session.currentUser.email})
  .then(coinsInfoFromDb =>{
    res.render("portfolio/portfolio", {coin: coinsInfoFromDb})
  })
})
module.exports = router;