const express = require('express');
const fs = require('fs');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const config = require('../config');
const Models = require('../modules/Modules');

const mongoURL = process.env.MONGO_DB_URL || 'mongodb://flash-app:11582924@ds157599.mlab.com:57599/flash-backend';
const models = Models(mongoURL);

const automateAccounts = function () {
    fs.readFile('./account.json', 'utf8', function (err, data) {
        if (err) throw err;

        var configObject = JSON.parse(data);

        //Loop through the json file
        console.log("Adding User Account to the Database....")
        
        configObject.accounts.forEach(element => {
                console.log(element)
            //Checking if the username is not already existing in the datase
    models.account.findOne({ AccNr: element.AccNr }, function (err, acc) {
                if (err) throw err;
            }).then(function (acc) {

                //Creating a new User account
                models.account.create({
                    AccNr:element.AccNr,
                    MTN: element.MTN,
                    Vodacom: element.Vodacom,
                    CellC: element.CellC
                }, function (err, results) {
                    //   if(err) throw err;
                    if (err) {
                        if (err.code === 11000) {
                            console.log(element.AccNr + ' already exist');

                        }

                    } else {
                        console.log('Results', results);
                    }

                })

            })

        });


    })
}(async function () { });
