const Quiz = require("../models/Quiz"); // import Quiz model

// Get only quiz answers for logged-in user
exports.getUserQuizScores = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch all quizzes attempted by this user
    const quizzes = await Quiz.find({ user: userId }).sort({ createdAt: 1 });

    if (!quizzes.length) {
      return res.status(404).json({ message: "No quizzes found for this user" });
    }

    // Extract only the `ans` values
    const scores = quizzes.map((quiz) => quiz.ans);

    res.json(scores); // return array only
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
