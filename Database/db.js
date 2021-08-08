const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("-------------Mongodb Database connected!!!!!------------");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectDb;