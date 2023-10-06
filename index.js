import express from "express";
import cors from "cors";
import AuthRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
import dbConnect from "./config/mongodb.config.js";
import passport from "passport";
import { localStrategy, jwtStrategy } from "./config/passport.config.js";

dotenv.config();

// PORT
const PORT = process.env.PORT;

// initialze express app
const app = express();

// connect Database
dbConnect();

// middleware setup
// CORS
app.use(
  cors({
    origin: "*",
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// pharse body
app.use(express.json());

//passport
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);


// mount routes
app.use("/api/v1/auth", AuthRouter);

// server listening to requests on port on env file
app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
