# SSL Certificate Checker

## What is this Project?
SSL Certificate Checker is a powerful tool that helps website owners and developers verify and monitor SSL certificates for their domains. This project provides a simple yet comprehensive API to analyze SSL certificate details and ensure website security.

## Problem it Solves
- Helps prevent SSL certificate expiration issues that could lead to website downtime
- Identifies potential security vulnerabilities in SSL configurations
- Simplifies the process of SSL certificate validation and monitoring
- Provides detailed insights about certificate chains and trust status
- Helps maintain website security and user trust

## Key Benefits
- Easy-to-use REST API interface
- Real-time certificate validation
- Comprehensive SSL certificate analysis
- DNS record verification
- Cipher suite information
- Automated certificate chain verification
- Perfect for integration into existing security workflows

## How it Works
1. Send a domain name to the API endpoint
2. The system performs multiple checks:
   - Validates SSL certificate
   - Checks expiration dates
   - Verifies domain matching
   - Analyzes certificate chain
   - Examines DNS records
   - Inspects cipher configurations
3. Receives detailed report about the certificate status

## Setup and Run Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ThakurAnkitSingh/SSL-Certification-Checker.git
   cd SSL-Certification-Checker
   ```

2. **Install Dependencies:**
   Make sure you have Node.js installed (version 14 or higher recommended). Then install the project dependencies:
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy the example environment file and update the values:
   ```bash
   cp .env.example .env
   ```

4. **Start the Server:**
   Run the development server with:
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```
   The server will start running at http://localhost:3000

5. **Test the API:**
   Use any API client (like Postman, cURL, or Thunder Client) to test the endpoint:

   **Endpoint:** `POST http://localhost:3000/api/v1/ssl/check`
   
   **Headers:**
   ```
   Content-Type: application/json
   ```

   **Request Body:**
   ```json
   {
     "domain": "example.com"
   }
   ```

## Technology Stack

- **Node.js:** Powers the backend with its efficient non-blocking I/O model, perfect for handling concurrent SSL certificate checks
- **Express.js:** Fast, unopinionated web framework that provides robust routing and middleware support
- **HTTPS/TLS Modules:** Native Node.js modules for secure certificate inspection
- **DNS Module:** For comprehensive DNS record verification
- **Jest:** For unit and integration testing (run tests with `npm test`)
