SSL Certificate Checker
Overview
The SSL Certificate Checker is a full-stack application that allows users to check the SSL certificate details of a given domain. It provides information on the certificate's validity status, expiration date, issuer, subject, and domain validity. The tool is designed to help users ensure their domains are secure and up-to-date with valid SSL certificates.

Features
Check SSL Certificate: Enter a domain to get details about its SSL certificate.
Display Information: See validity status, expiration date, issuer details, subject details, and domain validity.
Error Handling: Handle incorrect domain inputs and display meaningful error messages.
Technologies Used
Frontend: React, CSS
Backend: Node.js, Express, JavaScript, MVC, Rest APIs


How It Works
Enter Domain: Type a domain name into the input field and press Enter or click the "Check SSL" button.
View Results: The application sends a request to the backend to fetch SSL certificate details.
Display Information:
Validity Status: Indicates if the certificate is valid or expired.
Expiration Date: Shows the date when the certificate will expire.
Issuer: Lists the issuer details of the certificate.
Subject: Lists the subject details of the certificate.
Domain Validity: Checks if the certificate is valid for the entered domain.

Correct Response
{
  "validityStatus": "Valid",
  "expirationDate": "2024-10-28T06:37:25.000Z",
  "issuer": "Google Trust Services",
  "subject": "*.google.com",
  "domainValidity": "Valid",
  "isTrusted": true
}
Wrong Response - Enter the Domain Name, or Unaccepted error occuring in SSL Certification - if the certification wrong.

Feel free to submit issues or pull requests to improve the project. Your contributions are welcome!
