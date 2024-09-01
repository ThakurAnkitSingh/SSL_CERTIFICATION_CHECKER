const https = require('https');
const { exec } = require('child_process');

const checkSSL = async (req, res) => {
  const { domain } = req.body;

  try {
    const options = {
      host: new URL(domain).hostname,
      port: 443,
      method: 'GET',
      rejectUnauthorized: false,
    };

    const req = https.request(options, (response) => {
      const certificate = response.socket.getPeerCertificate(true);

      if (!certificate || Object.keys(certificate).length === 0) {
        return res.status(400).json({ error: 'No certificate found or certificate is invalid.' });
      }

      // Extract metadata
      const subject = certificate.subject;
      const issuer = certificate.issuer;
      const validFrom = certificate.valid_from;
      const validTo = certificate.valid_to;
      const serialNumber = certificate.serialNumber;
      const ocspUrl = certificate.ocsp_url

      // Validate expiry date
      const now = new Date();
      const isCurrentlyValid = now >= new Date(validFrom) && now <= new Date(validTo) ? "True" : "False";

      // Validate certificate chain
      const isValidChain = response.socket.authorized;

      // Verify that the certificate is valid for the input domain
      const validForDomain = subject.CN === options.host ? "True" : "False";

      if (ocspUrl) {
        // Check if the certificate has been revoked using OCSP
        const ocspCommand = `openssl ocsp -issuer ${issuer.CN} -serial ${serialNumber} -url ${ocspUrl} -CAfile /etc/ssl/certs/ca-certificates.crt`;

        exec(ocspCommand, (error, stdout, stderr) => {
          if (error) {
            return res.status(500).json({ error: 'Error checking certificate revocation status.' });
          }

          const isRevoked = stdout.includes('revoked');

          res.json({
            url: domain,
            tlsVersion: response.socket.getProtocol() || 'Unknown TLS Version',
            certificate: {
              subject,
              issuer,
              validFrom,
              validTo,
              serialNumber,
              validForDomain,
              isCurrentlyValid,
              isValidChain,
              isRevoked,
            },
          });
        });
      } else {
        res.json({
          url: domain,
          tlsVersion: response.socket.getProtocol() || 'Unknown TLS Version',
          certificate: {
            subject,
            issuer,
            validFrom,
            validTo,
            serialNumber,
            validForDomain,
            isCurrentlyValid,
            isValidChain,
            isRevoked: 'OCSP URL not available',
          },
        });
      }
    });

    req.on('error', (err) => {
      res.status(500).json({ error: `Error checking SSL` });
    });

    req.end();
  } catch (err) {
    res.status(500).json({ error: 'Invalid URL or server error' });
  }
}


module.exports = {
  checkSSL
};