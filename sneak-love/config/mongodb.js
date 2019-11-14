const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(dbConnectionResult =>
    console.log("connected", () => console.log("yay mongodb connected :)"))
  )
  .catch(err => {
    console.error("error", () => console.log("nay db error sorry :("));
  });

// mongoose.connection.on("connected", () => console.log("yay mongodb connected :)"));

// mongoose.connection.on("error", () => console.log("nay db error sorry :("));
