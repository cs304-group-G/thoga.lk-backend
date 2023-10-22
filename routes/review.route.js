import express from "express";
import passport from "passport";

import authorization from "../middleware/authorization.middleware.js";
import { addReview, getReviews } from "../controller/review.controller.js";

const router = express.Router();

router.post(
  "/:id",
  [passport.authenticate("jwt", { session: false }), authorization(["USER"])],
  addReview
);
router.get("/:id", getReviews);

export default router;