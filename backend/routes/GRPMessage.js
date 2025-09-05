const express = require("express");
const router = express.Router();
const messageController = require("../controllers/GrpMSG");
const { verifyToken } = require("../middleware/VerifyToken");

router.get("/group/:groupName", verifyToken, messageController.getMessagesByGroup);

router.post("/send", verifyToken, messageController.sendMessage);

module.exports = router;