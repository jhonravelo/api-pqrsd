var db = require('../db/db.js');
var async = require("async");

exports.getByEmail = (email) => {
    //Checking data
    if (email === undefined) email = "";
    var values = [email];
    //query database using promises
    const promisePool = db.get().promise();
    return promisePool.query('CALL strp_Login_getByEmail(?)', values);
}

exports.incrementLoginCount = (userId) => {
    //Checking data
    if (userId == undefined) userId = "";
    var values = [userId];
    // query database using promises
    const promisePool = db.get().promise();
    return promisePool.query('CALL strp_Login_incrementLoginCount(?)', values);
}