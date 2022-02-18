var db = require("../db/db.js");

exports.getAll = () => {
  // query database using promises
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Request_getAll()");
};

exports.getRequest = async (InputSearch) => {
  var value = [InputSearch];
  // query database using promises
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Request_getRequest(?)", value);
};

exports.getLogs = async () => {
  // query database using promises
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Log_getAll()");
};

exports.changeStatus = async (Id, Status) => {
  var values = [Id, Status];
  // query database using promises
  const promisePool = db.get().promise();
  return promisePool.query("CALL Update_requestStatus(?,?)", values);
};

exports.updateDependencies = async (Id, Dependencie) => {
  var values = [Id, Dependencie];
  // query database using promises
  const promisePool = db.get().promise();
  return promisePool.query("CALL Update_requestDependencies(?,?)", values);
};

exports.post = async (
  RequestType,
  Anonymous,
  PersonType,
  IdentificationType,
  Identification,
  Name,
  Email,
  Phone,
  Cell,
  Address,
  Country,
  Department,
  City,
  ResponseType,
  Inability,
  EthnicGroup,
  GroupInterest,
  Description,
  AcceptPolicy,
  Date,
  Status,
  Neighborhood
) => {
  var values = [
    RequestType,
    Anonymous,
    PersonType,
    IdentificationType,
    Identification,
    Name,
    Email,
    Phone,
    Cell,
    Address,
    Country,
    Department,
    City,
    ResponseType,
    Inability,
    EthnicGroup,
    GroupInterest,
    Description,
    AcceptPolicy,
    Date,
    Status,
    Neighborhood,
  ];

  //query database using promises
  const promisePool = db.get().promise();
  return promisePool.query(
    "CALL strp_Request_post(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    values
  );
};
