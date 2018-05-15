var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send(req.user);
});

router.post('/register', function (req, res) {
  Account.register(new Account({ username: req.body.username }), req.body.password, function (err, account) {
    if (err) {
      res.status(400).send('خطا در فرآیند ثبت نام' + '\n' + 'پیام خطا:' + err);
    }

    passport.authenticate('local')(req, res, function () {
      res.status(200).send('ثبت نام با موفقیت انجام شد');
    });
  });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.status(200).send('ورود با موفقیت انجام');
});

module.exports = router;