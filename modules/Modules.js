const mongoose = require('mongoose');
const assert = require('assert');

module.exports = function (url) { 
    mongoose.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to mongodb server");
    });

    mongoose.Promise = global.Promise;

    var UserSchema = new mongoose.Schema({
        username: String,
        role: String,
        password: String
      });

    UserSchema.index({username: 1}, {unique: true});
    var user =  mongoose.model('user', UserSchema);

    var AccountSchema = new mongoose.Schema({
        AccNr: Number,
        email: String,
        MTN: Number,
        Vodacom: Number,
        CellC: Number
      });

      AccountSchema.index({AccNr: 1}, {unique: true});
    var account =  mongoose.model('account', AccountSchema);

    return {
        user,
        account
    };
}