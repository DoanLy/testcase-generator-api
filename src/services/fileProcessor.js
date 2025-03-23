const mammoth = require("mammoth");
const XLSX = require("xlsx");
const pdfParse = require("pdf-parse");
const TestCase = require("../models/TestCase");
const aiService = require("./aiService");

class FileProcessor {
  static async processFile(file, customPrompt = "") {
    const fileType = file.mimetype;
    let content = "";

    try {
      console.log("Processing file:", file.originalname);
      console.log("File type:", fileType);
      console.log("Custom prompt:", customPrompt);

      switch (fileType) {
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          content = await this.processDocx(file);
          break;
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          content = await this.processExcel(file);
          break;
        case "application/pdf":
          content = await this.processPdf(file);
          break;
        default:
          throw new Error("Định dạng file không được hỗ trợ");
      }

      console.log("Extracted content length:", content.length);
      console.log("Content preview:", content.substring(0, 200));

      // Gửi nội dung và custom prompt đến AI service
      const testCases = await aiService.generateTestCases(
        content,
        customPrompt
      );
      console.log("Generated test cases:", testCases.length);
      return testCases;
    } catch (error) {
      console.error("Error processing file:", error);
      throw new Error(`Lỗi xử lý file: ${error.message}`);
    }
  }

  static async processDocx(file) {
    console.log("Processing DOCX file:", file.path);
    const result = await mammoth.extractRawText({ path: file.path });
    console.log("DOCX extraction result:", result.messages);
    return result.value;
  }

  static async processExcel(file) {
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  }

  static async processPdf(file) {
    const dataBuffer = require("fs").readFileSync(file.path);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }
}

module.exports = FileProcessor;
