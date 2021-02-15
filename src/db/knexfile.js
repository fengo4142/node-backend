const path = require("path");

module.exports = {
  development: {
    client: "sqlite",
    useNullAsDefault: true,
    connection: {
      filename: "./data.db",
    },
    migrations: {
      directory: path.join(__dirname, "./migrations"),
    },
    debug: true,
    seeds: {
      directory: path.join(__dirname, "./seeds"),
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
