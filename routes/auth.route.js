import express from "express";
import {
  forgetPasswordRequest,
  forgetPasswordReset,
  getUserData,
  login,
  passwordForceReset,
  register,
  updatePassword,
} from "../controller/auth.controller.js";
import passport from "passport";

const router = express.Router();

router.post("/register", register);
router.post(
  "/authenticate",
  [passport.authenticate("local", { session: false })],
  login
);
router.get(
  "/userdata",
  [passport.authenticate("jwt", { session: false })],
  getUserData
);
router.post(
  "/password-update",
  [passport.authenticate("jwt", { session: false })],
  updatePassword
);
router.post(
  "/password-force-reset",
  [passport.authenticate("jwt", { session: false })],
  passwordForceReset
);
router.post("/forget-password-request", forgetPasswordRequest);
router.post("/forget-password-reset", forgetPasswordReset);

export default router;
