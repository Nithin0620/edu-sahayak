const GRPMessage = require("../models/GrpMsg");
const Group = require("../models/Groups");
const {getReceiverSocketId,io} = require("../config/socketio");
/**
 * Get all messages for a specific group
 */
exports.getMessagesByGroup = async (req, res) => {
  try {
    const { groupName } = req.params;

    const group = await Group.findOne({name:groupName});
    if (!group) return res.status(404).json({ message: "Group not found" });

    const messages = await GRPMessage.find({ group: groupName })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Send a message to a group
 */
exports.sendMessage = async (req, res) => {
  try {
    const { groupId, content, type } = req.body;
    const senderId = req.user._id;

    const receiverSocketId = getReceiverSocketId(receiverId);

    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage);
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const message = await GRPMessage.create({
      group: groupId,
      sender: senderId,
      content,
      type: type || "text",
    });

    // Optional: emit to socket.io
    // const io = req.app.get("io");
    // io.to(groupId).emit("newMessage", message);

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
