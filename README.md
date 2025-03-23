# Test Case Management API

Backend API server for Test Case Management System that supports automatic test case generation from documents.

## Features

- Upload and process documents (PDF, Word, Excel)
- Automatically generate test cases from document content using OpenAI API
- Test case management (CRUD operations)
- Export test cases to Excel
- Integration with Oracle Database for data storage
- API endpoints for running Cypress automation tests

## System Requirements

- Node.js >= 14.0.0
- Oracle Database
- Oracle Instant Client

## Installation

1. Clone repository:

```bash
git clone https://github.com/DoanLy/testcase-generator-api.git
cd testcase-generator-api
```

2. Install dependencies:

```bash
npm install
```

3. Create .env file with environment variables:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
ORACLE_USER=your_oracle_username
ORACLE_PASSWORD=your_oracle_password
ORACLE_CONNECT_STRING=localhost:1521/your_service_name
```

4. Run SQL commands in `config/init.sql` to initialize the database

## Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Test Cases

- `POST /api/test-cases` - Create new test case
- `GET /api/test-cases` - Get list of test cases
- `GET /api/test-cases/:id` - Get test case details
- `PUT /api/test-cases/:id` - Update test case
- `DELETE /api/test-cases/:id` - Delete test case

### File Upload

- `POST /api/upload` - Upload document and generate test cases
- `GET /api/upload/history` - Get upload history

### Automation

- `POST /api/run-test` - Run automation test case
- `GET /api/test-results` - Get test results

## Dependencies

### Main Dependencies

- express: ^4.18.2 - Web framework
- cors: ^2.8.5 - CORS middleware
- multer: ^1.4.5-lts.1 - File upload handling
- xlsx: ^0.18.5 - Excel file processing
- pdf-parse: ^1.1.1 - PDF file processing
- mammoth: ^1.6.0 - Word file processing
- openai: ^4.89.0 - OpenAI API integration
- winston: ^3.8.2 - Logging
- morgan: ^1.10.0 - HTTP request logging
- dotenv: ^16.4.7 - Environment variables
- oracledb - Oracle Database driver

### Development Dependencies

- nodemon: ^2.0.22 - Development server with auto-reload

## Database Schema

### TEST_CASES Table

- id (VARCHAR2) - Primary key
- scenario_name (VARCHAR2) - Test case name/description
- menu (VARCHAR2) - Menu/module name
- priority (VARCHAR2) - Test priority (High/Medium/Low)
- status (VARCHAR2) - Test status
- automation_status (VARCHAR2) - Automation status
- created_at (TIMESTAMP) - Creation timestamp
- updated_at (TIMESTAMP) - Last update timestamp

### TEST_STEPS Table

- id (NUMBER) - Primary key
- test_case_id (VARCHAR2) - Foreign key to TEST_CASES
- step_number (NUMBER) - Step sequence number
- action (VARCHAR2) - Test step action
- test_data (CLOB) - Test data
- expected_result (CLOB) - Expected result

### UPLOAD_HISTORY Table

- id (NUMBER) - Primary key
- file_name (VARCHAR2) - Uploaded file name
- upload_date (TIMESTAMP) - Upload timestamp
- file_type (VARCHAR2) - File type
- file_size (NUMBER) - File size in bytes
- status (VARCHAR2) - Upload status
- custom_prompt (CLOB) - Custom generation prompt
- error_message (CLOB) - Error message if any
