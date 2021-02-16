const path = require("path");

require("dotenv").config();

module.exports = {
  development: {
    client: process.env.DIJOCA_DB_CONNECTION || "mysql",
    connection: {
      host: process.env.DIJOCA_DB_HOST || "localhost",
      user: process.env.DIJOCA_DB_USERNAME || "root",
      password: process.env.DIJOCA_DB_PASSWORD || "root",
      database: process.env.DIJOCA_DB_DATABASE || "nodejsapp",
      port: process.env.DIJOCA_DB_PORT,
      charset: "utf8",
      timezone: "Z",
    },
    migrations: {
      directory: path.join(__dirname, "./migrations"),
    },
    debug: true,
    seeds: {
      directory: path.join(__dirname, "./seeds/dev"),
    },
    pool: {
      min: 2,
      max: 100,
      afterCreate: function (connection, callback) {
        connection.query("SET time_zone = UTC", function (err) {
          callback(err, connection);
        });
      },
    },
  },

  test: {
    client: "sqlite",
    useNullAsDefault: true,
    connection: {
      filename: "./data.db",
    },
    migrations: {
      directory: path.join(__dirname, "./migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "./seeds/test"),
    },
  },
};
