var db = require('../db/db.js');


exports.getAll = () => {
    // query database using promises
    const promisePool = db.get().promise();
    return promisePool.query('CALL strp_User_getUsers()');
}

exports.getById = async (userId) => {
    //Checking data
    if (userId === undefined) userId = "";
    var values = [userId];
    // query database using promises
    const promisePool = db.get().promise();
    return promisePool.query('CALL strp_User_getById(?)', values);
}

exports.post = async (usuario, clave, esAdmin, estado, destino) => {
    //Checking data
    if (usuario == undefined) usuario = "";
    if (clave == undefined) clave = "";
    if (esAdmin == undefined) esAdmin = "";
    if (estado == undefined) estado = "";
    if (destino == undefined) destino = "";
    
    var values = [usuario, clave, esAdmin, estado, destino];

    // query database using promises
    const promisePool = db.get().promise();
    return promisePool.query('CALL strp_User_post(?,?,?,?,?)', values);
}
exports.patch = async (id, usuario, clave, esAdmin, estado, destino) => {
    //Checking data
    if (id == undefined) id = null;
    if (usuario == undefined) usuario = null;
    if (clave == undefined) clave = "";
    if (esAdmin == undefined) esAdmin = null;
    if (estado == undefined) estado = null;
    if (destino == undefined) destino = null;
    
    var values = [id, usuario, clave, esAdmin, estado, destino];
    // query database using promises
    const promisePool = db.get().promise();
    return promisePool.query('CALL strp_User_patch(?,?,?,?,?,?)', values);
}
exports.delete = async (userId) => {
    var values = [userId];
    if (userId === undefined) userId = "";
    // query database using promises
    const promisePool = db.get().promise();
    return promisePool.query('CALL strp_User_delete(?)', values);
}