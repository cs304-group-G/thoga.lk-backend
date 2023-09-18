import express from "express";

const router = express.Router();

router.post("/register", registerUser);

module.exports = router;
