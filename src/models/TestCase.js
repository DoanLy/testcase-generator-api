class TestCase {
  constructor(data) {
    this.id = data.id;
    this.scenarioName = data.scenarioName;
    this.menu = data.menu;
    this.priority = data.priority;
    this.status = data.status || "To-Do";
    this.steps = data.steps || [];
  }

  static validatePriority(priority) {
    return ["High", "Medium", "Low"].includes(priority);
  }

  static validateStatus(status) {
    return [
      "Passed",
      "Failed",
      "Processing",
      "To-Do",
      "Canceled",
      "N/A",
    ].includes(status);
  }

  validate() {
    if (!this.id || !this.scenarioName || !this.menu || !this.priority) {
      throw new Error("Thiếu thông tin bắt buộc cho test case");
    }

    if (!TestCase.validatePriority(this.priority)) {
      throw new Error("Priority không hợp lệ");
    }

    if (!TestCase.validateStatus(this.status)) {
      throw new Error("Status không hợp lệ");
    }

    if (!Array.isArray(this.steps)) {
      throw new Error("Steps phải là một mảng");
    }

    this.steps.forEach((step, index) => {
      if (!step.stepNumber || !step.action || !step.expectedResult) {
        throw new Error(`Thiếu thông tin bắt buộc cho step ${index + 1}`);
      }
    });

    return true;
  }
}

module.exports = TestCase;
