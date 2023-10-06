import bcrypt from "bcrypt";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";

import User from "../models/user.model.js";

// passport js
const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

// get JWT SECRET from .env file
const SECRET_KEY = process.env.SECRET_KEY;

// Create local strategy
const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Invalid email" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

// Create JWT strategy
const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
  },
  async (jwtPayload, done) => {
    User.findOne({ email: jwtPayload.email })
      .then((user) => {
        return done(null, user);
      })
      .catch((err) => {
        return done(null, false);
      });
  }
);

export { localStrategy, jwtStrategy };
