const express = require('express');
const router = express.Router();
const Coin = require('../models/Coin.model');
const Watchlist = require('../models/Watchlist.model');
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn.js")
const axios = require("axios");
const p3 = require('../config/backup')


router.get("/charts", (req, res) => {
  // res.render("views/index");
  res.render("charts")
});

router.get("/learn", (req, res) => {
  // res.render("views/index");
  res.render("learn");
});

// Add to portfolio: Display form

router.post("/portfolio/add", isLoggedIn, async (req, res, next) => {
  const coin = {
    name: req.body.coinName,
    owned: req.body.amount,
    coinId: req.body.coinId,
    purchasedAt: req.body.purchasedAt,
    addedBy: req.session.currentUser ? req.session.currentUser.email : "",
    image: req.body.image,
  };

  const coinInfoFromDb = await Coin.create(coin);

  res.redirect("/crypto/portfolio");
  res.render("portfolio/portfolio", { coinInfoFromDb });
});

//GET Edit coin
router.get(`/:coinId/edit`, isLoggedIn, (req, res, next) => {
  const { coinId } = req.params;

  Coin.findByIdAndUpdate(coinId)
    .then((coinToEdit) => {
      coinDetails = coinToEdit;
      res.render("portfolio/coin-update", { coin: coinToEdit });
    })
    .catch((error) => next(error));
});

router.post(`/:coinId/edit`, (req, res, next) => {
  const { coinId } = req.params;
  const { owned, purchasedAt } = req.body;

  Coin.findByIdAndUpdate(coinId, { owned, purchasedAt }, { new: true })
    .then(() => res.redirect(`/crypto/portfolio`))
    .catch((error) => { res.redirect("/crypto/portfolio"); });
});



router.get('/portfolio', (req, res, next) => {
  Coin.find({ addedBy: req.session.currentUser.email })
    .then(coinsInfoFromDb => {

      let resultsArr = []
      let totalPortfolioValue = 0;
      let totalSpent = 0;
      let differencePercent = 0;
      for (let i = 0; i < p3.length; i++) {
        const firstListObject = p3[i]
        for (let j = 0; j < coinsInfoFromDb.length; j++) {
          const portfolioListObject = coinsInfoFromDb[j]
          if (firstListObject.name == portfolioListObject.name) {
            totalPortfolioValue += ((firstListObject.current_price) * (portfolioListObject.owned))
            totalPortfolioValue = Math.round(totalPortfolioValue * 100) / 100
            totalSpent += Math.round((portfolioListObject.purchasedAt * portfolioListObject.owned) * 100) / 100

            let newObj = { ...portfolioListObject.toObject(), price: firstListObject.current_price, currentValue: firstListObject.current_price * portfolioListObject.owned }

            resultsArr.push(newObj)
          }
        }
      }

      differencePercent = (((totalPortfolioValue) - (totalSpent)) / totalSpent * 100).toFixed(0)

      res.render("portfolio/portfolio", { coin: resultsArr, totalPortfolioValue, differencePercent })
    })
});

//POST Delete coin
router.post(`/:coinId/delete`, isLoggedIn, (req, res, next) => {
  const { coinId } = req.params

  Coin.findByIdAndDelete(coinId)
    .then(() => res.redirect(`/crypto/portfolio`))
    .catch((error) => next(error));
});

router.get("/news", (req, res) => {
  axios.get("https://newsapi.org/v2/everything?q=crypto&sortBy=publishedAt&language=en&apiKey=42a0cfb20870473e851473bcecc219e0")
    .then((response) => {
      res.render("news", { articles: response.data.articles });
    })
    .catch((error) => {
      console.log(error);
      res.render("news", { articles: null });
    });
});

// Add coin to the watchlist

router.post("/portfolio/addToWatchlist", isLoggedIn, async (req, res, next) => {
  const watchCoin = {
    watchCoinName: req.body.watchCoinName,
    watchCoinId: req.body.watchCoinId,
    watchAddedBy: req.session.currentUser ? req.session.currentUser.email : "",
    watchPriceWhenAdded: req.body.watchCurrPrice,
    watchImage: req.body.watchImage,
  };

  console.log("this is your watch coin********", watchCoin);

  const watchCoinInfoFromDb = await Watchlist.create(watchCoin);
  res.redirect("/crypto/watchlist");
});

router.get('/watchlist', (req, res, next) => {

  Watchlist.find({ watchAddedBy: req.session.currentUser.email })
    .then(watchlistCoinsFromDb => {

      let resultsArr = []

      for (let i = 0; i < p3.length; i++) {
        const firstListObject = p3[i]
        for (let j = 0; j < watchlistCoinsFromDb.length; j++) {
          const portfolioListObject = watchlistCoinsFromDb[j]
          if (firstListObject.name == portfolioListObject.watchCoinName) {

            let newObj1 = { ...portfolioListObject.toObject(), currPrice: firstListObject.current_price }

            resultsArr.push(newObj1)
          }
        }
      }
      res.render("watchlist/watchlist", { coins: resultsArr })
    })
});

//POST Delete coin from watchlist
router.post(`/:id/watchlist/delete`, isLoggedIn, (req, res, next) => {

  
  const { id } = req.params

  Watchlist.findByIdAndDelete(id)
    .then(() => res.redirect(`/crypto/watchlist`))
    .catch((error) => next(error));
});





module.exports = router;


