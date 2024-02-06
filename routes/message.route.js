import express from "express";
import { getChatByUser, getChats, sendMessage } from "../controller/message.controller.js";
import passport from "passport";

const router = express.Router();

router.post(
  "/sendMessage/:id",
  [passport.authenticate("jwt", { session: false })],
  sendMessage
);

router.get(
  "/",
  [passport.authenticate("jwt", { session: false })],
  getChats
);

router.get(
    "/:id",
    [passport.authenticate("jwt", { session: false })],
    getChatByUser
  );

export default router;
