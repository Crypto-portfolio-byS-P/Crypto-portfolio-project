const express = require('express');
const router = express.Router();
const Coin = require('../models/Coin.model');
const mongoose = require("mongoose");

// let currentUserEmail

router.get("/charts", (req, res) => {
  // res.render("views/index");
  res.render("charts")
});

router.get("/news", (req, res) => {
  // res.render("views/index");
  res.render("news");
});
// router.get("/portfolio", (req, res) => {
//   res.render("portfolio/portfolio");
// });


// Add to portfolio: Display form

router.post('/portfolio/add', async (req, res, next) => {

  // console.log(req.session.currentUser)


  const coin = {
    name: req.body.coinName,
    owned: req.body.amount,
    coinId: req.body.coinId,
    purchasedAt: req.body.purchasedAt,
    addedBy: req.session.currentUser ? req.session.currentUser.email : '',
    image: req.body.image
  }

  const coinInfoFromDb = await Coin.create(coin)

  console.log('---->', coinInfoFromDb.data)
  res.redirect("/crypto/portfolio")
  res.render("portfolio/portfolio", { coinInfoFromDb })

})

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

router.get('/portfolio', (req, res, next) => {

  if (req.session.currentUser) {

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

    Coin.find({ addedBy: req.session.currentUser.email })
      .then(coinsInfoFromDb => {

        let resultsArr = []

        for (let i = 0; i < req.session.p1.length; i++) {
          const firstListObject = req.session.p1[i]
          for (let j = 0; j < coinsInfoFromDb.length; j++) {
            const portfolioListObject = coinsInfoFromDb[j]
            console.log(portfolioListObject)
            if (firstListObject.name == portfolioListObject.name) {
              let newObj = { ...portfolioListObject, price: firstListObject.current_price, currentValue: firstListObject.current_price * portfolioListObject.owned }
              resultsArr.push(newObj)
            }
          }
        }
        res.render("portfolio/portfolio", { coin: resultsArr, })

      })

  } else {
    res.redirect('/login')
  }
})
module.exports = router;
