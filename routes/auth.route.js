import express from "express";
import { login, register } from "../controller/auth.controller.js";
import passport from "passport";

const router = express.Router();

router.post("/register", register);
router.post(
  "/authenticate",
  [passport.authenticate("local", { session: false })],
  login
);

export default router;
