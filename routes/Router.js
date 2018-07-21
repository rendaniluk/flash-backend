"use strict";

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config");

module.exports = function(Model) {
  //get account and update
  const getAccount = function(req, res, next) {
    var amount = req.body.amount;
    Model.account.findOne(
      {
        AccNr: req.body.AccNr
      },
      function(err, currAcount) {
        if (err) {
          return next(err);
        } else if (currAcount) {
          currAcount.amount += +amount;
          currAcount.save();
          res.json(currAcount);
        }
      }
    );
  };
  //get total amount for the user
  const accountTotal = function(req, res, next) {
    Model.account.findOne(
      {
        email: req.body.email
      },
      function(err, currAcount) {
        if (err) {
          return next(err);
        } else if (currAcount) {
          var totalAmount = currAcount.amount;
          console.log(totalAmount);
          res.json({ total: totalAmount });
        }
      }
    );
  };

  const getOneAcc = function(req, res, next) {
    Model.account
      .findOne({
        AccNr: req.body.AccNr
      })
      .then(),
      function(err, acc) {
        if (err) return res.status(500).send("Error on the server.");
        if (!acc) return res.status(404).send("No user found.");
        console.log(acc);
        res.json(acc);
      };
  };

  const register = function(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    Model.user.create(
      {
        username: req.body.username,
        role: req.body.role,
        password: hashedPassword
      },
      function(err, user) {
        if (err)
          return res
            .status(500)
            .send("There was a problem registering the user.");
        // create a token
        var token = jwt.sign(
          {
            id: user._id
          },
          config.secret,
          {
            expiresIn: 86400 // expires in 24 hours
          }
        );
        res.status(200).send({
          auth: true,
          token: token
        });
      }
    );
  };

  const access_denied = function(req, res) {
    res.json("access_denied");
  };

  return {
    register,
    access_denied,
    getAccount,
    getOneAcc,
    accountTotal
  };
};
