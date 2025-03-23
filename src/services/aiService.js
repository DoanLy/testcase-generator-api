const axios = require("axios");
const TestCase = require("../models/TestCase");

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  }

  async generateTestCases(content, customPrompt = "") {
    try {
      const basePrompt = `
        Analyze the following document and generate test cases in JSON format.
        The response MUST be a valid JSON array of test cases with this exact structure:
        [
          {
            "id": "TC-XX",
            "scenarioName": "string",
            "menu": "string",
            "priority": "High|Medium|Low",
            "status": "To-Do",
            "steps": [
              {
                "stepNumber": number,
                "action": "string",
                "testData": "string",
                "expectedResult": "string"
              }
            ]
          }
        ]
        
        Rules:
        1. Each test case MUST follow this exact structure
        2. Priority MUST be one of: "High", "Medium", "Low"
        3. Status should always be "To-Do" for new test cases
        4. Steps array MUST contain at least one step
        5. StepNumber MUST start from 1 and increment
        6. All string fields MUST be properly escaped JSON strings
        7. Response MUST be a valid JSON array only, no additional text
        8. Expected result: base on document content and follow the example:
        Example:
        Requirement: "When the user enters the correct email and password, the system must log in successfully and go to the dashboard page." 
        Expected Result: The system displays the Dashboard page with the user information after logging in.
      `;

      const documentPrompt = `
        Document content to analyze:
        ${content}
      `;

      const customInstructions = customPrompt
        ? `
        Additional requirements for test case generation:
        ${customPrompt}
        Remember to maintain the exact JSON structure specified above.
      `
        : "";

      const finalPrompt = `
        ${basePrompt}
        ${documentPrompt}
        ${customInstructions}
      `;

      console.log("Sending prompt to Gemini API...");

      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: finalPrompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let generatedText = response.data.candidates[0].content.parts[0].text;
      // Tìm và trích xuất mảng JSON từ response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Không tìm thấy mảng JSON trong phản hồi");
      }

      const jsonStr = jsonMatch[0];

      try {
        const parsedTestCases = JSON.parse(jsonStr);
        // Validate cấu trúc của từng test case trước khi chuyển đổi
        const validatedTestCases = parsedTestCases.map((tc) => {
          if (
            !tc.id ||
            !tc.scenarioName ||
            !tc.menu ||
            !tc.priority ||
            !tc.steps
          ) {
            throw new Error(
              `Test case thiếu thông tin bắt buộc: ${JSON.stringify(tc)}`
            );
          }
          return new TestCase(tc);
        });

        return validatedTestCases;
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error(`Invalid JSON format: ${parseError.message}`);
      }
    } catch (error) {
      console.error("Error in generateTestCases:", error);
      throw new Error(`Failed to generate test cases: ${error.message}`);
    }
  }
}

module.exports = new AIService();
