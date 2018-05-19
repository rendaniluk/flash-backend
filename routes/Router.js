"use strict"

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const config = require('../config');

module.exports = function(Model) {
 
  const getAccount = function (req, res, next) {
    var MTN = req.body.MTN;
    var Vodacom = req.body.Vodacom;
    var CellC = req.body.CellC;
    Model.account.findOne({
      AccNr: req.body.AccNr
    }, function(err, currAcount) {
      if (err) {
        return next(err)
      } else if (currAcount) {
        currAcount.MTN += +MTN;
        currAcount.Vodacom += +Vodacom;
        currAcount.CellC += +CellC;
        currAcount.save()
        res.json(currAcount)
      }
    });
  }

const accountTotal = function (req, res, next) {
  Model.account.findOne({
    AccNr: req.body.AccNr
  }, function(err, currAcount) {
    if (err) {
      return next(err)
    } else if (currAcount) {
     var totalAmount = +currAcount.MTN+
       +currAcount.Vodacom+
       +currAcount.CellC;
      currAcount = totalAmount;
      console.log(totalAmount)
    res.json({total: totalAmount})
    }
  });
}
//https://sleepy-castle-40323.herokuapp.com/ 
  const getOneAcc = function (req, res, next) {
    Model.account.findOne({
      AccNr: req.body.AccNr
          }, function (err, acc) {
        if (err) return res.status(500).send('Error on the server.');
        if (!acc) return res.status(404).send('No user found.');
        console.log(acc)
        res.json(acc)
      })
  }

  const register = function(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    Model.user.create({
        username: req.body.username,
        role: req.body.role,
        password: hashedPassword
      },
      function(err, user) {
        if (err) return res.status(500).send(
            "There was a problem registering the user.")
          // create a token
        var token = jwt.sign({
          id: user._id
        }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({
          auth: true,
          token: token
        });
      });
  }

  const access_denied = function(req, res) {
    res.json("access_denied");
  }

  return {
    register,
    access_denied,
    getAccount,
    getOneAcc,
    accountTotal
  }
}
