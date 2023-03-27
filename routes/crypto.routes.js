const express = require("express");
const router = express.Router();
const Coin = require("../models/Coin.model");
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");

// let currentUserEmail

router.get("/charts", (req, res) => {
  // res.render("views/index");
  res.render("charts");
});

// Add to portfolio: Display form

router.post("/portfolio/add", (req, res, next) => {
  const coin = {
    name: req.body.coinName,
    owned: req.body.amount,
    coinId: req.body.coinId,
    purchasedAt: req.body.purchasedAt,
    addedBy: req.session.currentUser.email,
    image: req.body.image,
  };

  Coin.create(coin).then((coinInfoFromDb) => {
    // console.log(coinInfoFromDb)
    res.redirect("/crypto/portfolio");
    res.render("portfolio/portfolio", { coinInfoFromDb });
  });
});

router.get(`/portfolio`, (req, res, next) => {
  console.log(req.session);

  Coin.find({ addedBy: req.session.currentUser.email }).then(
    (coinsInfoFromDb) => {
      res.render(`portfolio/portfolio`, { coin: coinsInfoFromDb });
    }
  );
});

//GET Edit coin
router.get(`/:coinId/edit`, isLoggedIn, (req, res, next) => {
  const { coinId } = req.params;

  Coin.findByIdAndUpdate(coinId)
    .then((coinToEdit) => {
      coinDetails = coinToEdit;
      res.render("portfolio/coin-update", {coin : coinToEdit });
    })
    .catch((error) => next(error));


});

//POST Edit coin
router.post(`/:coinId/edit`, (req, res, next) => {
  const { coinId } = req.params;
  const { owned, purchasedAt } = req.body;

  Coin.findByIdAndUpdate(coinId, { owned, purchasedAt }, { new: true })
    .then(() => res.redirect(`/crypto/portfolio`))
    .catch((error) => {res.redirect("/crypto/portfolio");});
});

//POST Delete coin
router.post(`/:coinId/delete`, isLoggedIn, (req, res, next) => {
  const { coinId } = req.params

  Coin.findByIdAndDelete(coinId)
    .then(() => res.redirect(`/crypto/portfolio`))
    .catch((error) => next(error));
});




module.exports = router;
