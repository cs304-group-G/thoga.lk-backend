import express from "express";
import passport from "passport";
import {
  addProduct,
  deleteProduct,
  findAll,
  findOne,
} from "../controller/product.controller.js";
import authorization from "../middleware/authorization.middleware.js";
import fileHandler from "../middleware/multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    authorization(["SELLER"]),
    fileHandler.array("photos", 5),
  ],
  addProduct
);
router.get("/", findAll);
router.get("/:id", findOne);
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    authorization(["SELLER", "MODERATOR", "ADMIN"]),
  ],
  deleteProduct
);

export default router;
