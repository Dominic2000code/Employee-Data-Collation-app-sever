const knex = require("./Knex");

function getAllEmployees() {
  return knex("employees").select("*");
}

module.exports = { getAllEmployees };
