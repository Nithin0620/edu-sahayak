const axios = require('axios');


exports.getFlashcards = async (req, res) => {
  const query = req.query.query; // from ?query= in URL

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Query parameter 'query' is required"
    });
  }

  try {
    const aiApiUrl = `http://InsaneJSK-Code4Bharat-API.hf.space/generate-flashcards?cid=${encodeURIComponent(query)}&count=3`;
    // const aiApiUrl = `https://InsaneJSK-Code4Bharat-API.hf.space/yt-search?query=${encodeURIComponent(query)}`;

    const response = await axios.get(aiApiUrl);
    const videos = response.data;

    return res.status(200).json({
      success: true,
      message: "Flashcards Questions Fetched",
      data: videos
    });
    console.log();
  } catch (error) {
    console.error("AI API call failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch flashcards question",
    });
  }
};
