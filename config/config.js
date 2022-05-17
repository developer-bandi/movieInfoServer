require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "movieinfos",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "movieinfos_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "rvvbvx1xsivfwi6p",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "o7d0aqsay1eq22vd",
    host: "un0jueuv2mam78uv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    dialect: "mysql",
    logging: false,
  },
};
