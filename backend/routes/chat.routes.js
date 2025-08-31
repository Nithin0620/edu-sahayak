const express = require('express');
const { chatWithAI, getUserSessions, getMessagesBySession } = require('../controllers/chatController');
const { verifyToken } = require('../middleware/VerifyToken'); 

const router = express.Router();

router.post('/message', verifyToken,chatWithAI );
router.get('/sessions', verifyToken, getUserSessions);
router.get('/messages/:sessionId', verifyToken, getMessagesBySession);

module.exports = router;
