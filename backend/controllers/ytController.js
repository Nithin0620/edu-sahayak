const axios = require('axios');


exports.getTopVideos = async (req, res) => {
  const query = req.query.query; // from ?query= in URL

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Query parameter 'query' is required"
    });
  }

  try {
    const aiApiUrl = `https://InsaneJSK-Code4Bharat-API.hf.space/yt-search?query=${encodeURIComponent(query)}`;

    const response = await axios.get(aiApiUrl);
    const videos = response.data;

    return res.status(200).json({
      success: true,
      message: "Top videos fetched successfully",
      data: videos
    });

  } catch (error) {
    console.error("AI API call failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch top videos",
    });
  }
};
