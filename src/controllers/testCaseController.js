const FileProcessor = require("../services/fileProcessor");

const uploadAndGenerate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Lấy custom prompt từ request nếu có
    const customPrompt = req.body.customPrompt;

    // Gửi file và custom prompt đến FileProcessor
    const testCases = await FileProcessor.processFile(req.file, customPrompt);

    res.json({ testCases });
  } catch (error) {
    console.error("Error in uploadAndGenerate:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateTestCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // TODO: Implement database update logic
    res.json({ message: `Updated status to ${status} for test case ${id}` });
  } catch (error) {
    console.error("Error in updateTestCase:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadAndGenerate,
  updateTestCase,
};
