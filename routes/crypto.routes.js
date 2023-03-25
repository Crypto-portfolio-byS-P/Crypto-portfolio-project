const express = require('express');
const router = express.Router();

router.get("/charts",  (req, res) => {
    // res.render("views/index");
    res.send("hello")
  });

  router.get("/news", (req, res) => {
    res.render("views/news");
  });

module.exports = router;