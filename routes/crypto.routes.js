const express = require('express');
const router = express.Router();
const Coin = require('../models/Coin.model');
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn.js")

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
      for (let i = 0; i < req.session.p1.length; i++) {
        const firstListObject = req.session.p1[i]
        for (let j = 0; j < coinsInfoFromDb.length; j++) {
          const portfolioListObject = coinsInfoFromDb[j]
          if (firstListObject.name == portfolioListObject.name) {
            totalPortfolioValue += ((firstListObject.current_price).toFixed(2) * (portfolioListObject.owned).toFixed(2))
            totalSpent +=portfolioListObject.purchasedAt * portfolioListObject.owned

            
            let newObj = { ...portfolioListObject.toObject(), price: firstListObject.current_price, currentValue: firstListObject.current_price * portfolioListObject.owned }
            
            resultsArr.push(newObj)
          }
          
        }
        
      }
 
      differencePercent = (((totalPortfolioValue) - (totalSpent)) / totalSpent * 100).toFixed(0)
      console.log("total value is **********",totalPortfolioValue)
      console.log("total spent", totalSpent.toFixed(2))
      console.log("difference is", differencePercent)



      res.render("portfolio/portfolio", { coin: resultsArr, totalPortfolioValue, differencePercent})

    })

});

//POST Delete coin
router.post(`/:coinId/delete`, isLoggedIn, (req, res, next) => {
  const { coinId } = req.params

  Coin.findByIdAndDelete(coinId)
    .then(() => res.redirect(`/crypto/portfolio`))
    .catch((error) => next(error));
});




module.exports = router;


