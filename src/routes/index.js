const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const TestCaseController = require("../controllers/testCaseController");

// Upload file và generate test cases
router.post(
  "/upload",
  upload.single("file"),
  TestCaseController.uploadAndGenerate
);

// Cập nhật status của test case
router.patch("/testcases/:id/status", TestCaseController.updateTestCase);

module.exports = router;
