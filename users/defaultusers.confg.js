const express = require('express');
const fs = require('fs');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const config = require('../config');
const Models = require('../modules/Modules');

const mongoURL = process.env.MONGO_DB_URL || 'mongodb://localhost/flash-backend';
const models = Models(mongoURL);

const automateUsers = function () {
    fs.readFile('./config.json', 'utf8', function (err, data) {
        if (err) throw err;

        var configObject = JSON.parse(data);

        //Loop through the json file
        console.log("Adding User Account to the Database....")
        
        configObject.users.forEach(element => {

            //Checking if the username is not already existing in the datase
            models.user.findOne({ username: element.username }, function (err, user) {
                if (err) throw err;
            }).then(function (user) {

                //Creating a new User account
                models.user.create({
                    username: element.username,
                    password: bcrypt.hashSync(element.password, 8),
                    role: element.role
                }, function (err, results) {
                    //   if(err) throw err;
                    if (err) {
                        if (err.code === 11000) {
                            console.log(element.username + ' already exist');

                        }

                    } else {
                        console.log('Results', results);
                    }

                })

            })

        });


    })
}(async function () { });
