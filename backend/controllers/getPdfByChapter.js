// const axios = require('axios');

// exports.getPDFByChapter = async (req, res) => {
//   const { class: className, subject, chapterName, chapterNumber } = req.query;

//   if (!className || !subject || (!chapterName && !chapterNumber)) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required query parameters: class, subject, and chapterName or chapterNumber",
//     });
//   }

//   try {
//     const apiUrl = ``;

//     const response = await axios.get(apiUrl, {
//       params: {
//         class: className,
//         subject,
//         chapterName,
//         chapterNumber,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       data: response.data, 
//     });

//   } catch (error) {
//     console.error("PDF retrieval failed:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to retrieve PDF",
//     });
//   }
// };
