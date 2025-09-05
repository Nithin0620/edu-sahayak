const Group = require("../models/Groups");
const User = require("../models/User");
const Message = require("../models/GrpMsg");


exports.getGroupsByUserClass = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const groups = await Group.find({ class: user.class });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getJoinedGroups = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("joinedGroups");
    res.json(user.joinedGroups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.joinGroup = async (req, res) => {
  try {
    const { grpName } = req.body;
    const userId = req.user.userId;

    const group = await Group.findOne({name:grpName});
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Add user to group's members if not already present
    if (!group.members.includes(userId)) group.members.push(userId);
    await group.save();

    // Add group to user's joinedGroups
    const user = await User.findById(userId);
    if (!user.joinedGroups.includes(grpName)) user.joinedGroups.push(grpName);
    await user.save();

    res.json({ message: "Joined group successfully", group });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.leaveGroup = async (req, res) => {
  try {
    const { grpName } = req.body;
    const userId = req.user.userId;

    await Group.findOneAndUpdate({name:grpName}, { $pull: { members: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { joinedGroups: grpName } });

    res.json({ message: "Left group successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

