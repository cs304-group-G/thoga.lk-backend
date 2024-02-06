import express from "express";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";

import dbConnect from "./config/mongodb.config.js";
import { localStrategy, jwtStrategy } from "./config/passport.config.js";

// import routes
import AuthRouter from "./routes/auth.route.js";
import ProductRouter from "./routes/product.route.js";
import ReviewRouter from "./routes/review.route.js";
import ChatRouter from "./routes/message.route.js";

dotenv.config();

// PORT
const PORT = process.env.PORT;

// initialze express app
const app = express();

// connect Database
dbConnect();

// CORS configuration
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

// pharse body from request
app.use(express.json());

//passport
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// mount routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/review", ReviewRouter);
app.use("/api/v1/chat", ChatRouter );

// server listening to requests on PORT on env file
app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
