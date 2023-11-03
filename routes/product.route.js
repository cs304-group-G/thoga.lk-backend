import express from "express";
import passport from "passport";
import {
  addProduct,
  deleteProduct,
  findAll,
  findOne,
} from "../controller/product.controller";
import authorization from "../middleware/authorization.middleware";
import fileHandler from "../middleware/multer.middleware";

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
