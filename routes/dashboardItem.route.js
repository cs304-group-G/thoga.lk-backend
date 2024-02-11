import express from "express";
import passport from "passport";
import authorization from "../middleware/authorization.middleware.js";
import {
  addItem,
  deleteItem,
  editItem,
  findAll,
  findOne,
} from "../controller/dashboardItem.controller.js";

const router = express.Router();

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    authorization(["MODERATOR", "ADMIN"]),
  ],
  addItem
);
router.get("/", findAll);
router.get("/:id", findOne);
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    authorization(["MODERATOR", "ADMIN"]),
  ],
  deleteItem
);
router.patch(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    authorization(["MODERATOR", "ADMIN"]),
  ],
  editItem
);

export default router;
