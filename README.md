# SSL Certificate Checker

## Description
This project provides a RESTful API to check SSL certificate details for a given domain. It verifies certificate validity, expiration, domain matching, and checks if the certificate chain can be trusted.

## Setup and Run Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ThakurAnkitSingh/SSL-Certification-Checker.git
   cd SSL-Certification-Checker

2. Install Dependencies: Make sure you have Node.js installed. Then, install the project dependencies:
   npm install
3. Start the Server: Run the server with:
   npm start

The server will be running at http://localhost:3000.

4. Test the API: Use an API client like Postman or curl to test the endpoint:

Endpoint: POST http://localhost:3000/v1/ssl/check
Request Body:
{
  "domain": "example.com"
}

Technology Choices
Node.js: Chosen for its non-blocking I/O model, which is well-suited for handling multiple simultaneous network requests.
HTTPS Module: Used to fetch SSL certificates directly from the server.
Express.js (if used in your setup): A minimal and flexible Node.js web application framework.

