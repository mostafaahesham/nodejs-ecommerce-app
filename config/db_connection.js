const mongoose = require("mongoose");

const dbConnection = (app, server) => {
  app.listen(process.env.PORT, () => {
    console.log(`App Running on port ${process.env.PORT}`);

    mongoose.connect(process.env.DB_URI).then((conn) => {
      console.log(`Connected to Database: ${conn.connection.host}`);
    });
    return server;
  });
};

module.exports = dbConnection;
