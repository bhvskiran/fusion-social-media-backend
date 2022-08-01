import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";

// Routes

const app = express();

// Middleware
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

dotenv.config()

mongoose
  .connect(
    process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("connected to MongoDB successfully...")
    app.listen(process.env.PORT, () => console.log(`Listening at http://localhost:${process.env.PORT}/`))
  })
  .catch((error) => {
    console.log(error)
  })

// Usage of Routes
app.use("/auth", AuthRoute)
app.use("/user", UserRoute)
app.use("/posts", PostRoute)