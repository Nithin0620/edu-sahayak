const express = require("express");
const router = express.Router();
const {getGroupsByUserClass,getJoinedGroups,joinGroup,leaveGroup} = require("../controllers/Group");


const { verifyToken } = require("../middleware/VerifyToken");

router.get("/class-groups", verifyToken, getGroupsByUserClass);

router.get("/joined-groups", verifyToken, getJoinedGroups);

router.post("/join", verifyToken, joinGroup);

router.post("/leave", verifyToken, leaveGroup);


module.exports = router;
