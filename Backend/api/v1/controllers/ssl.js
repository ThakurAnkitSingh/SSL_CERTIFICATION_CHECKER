const https = require('https');

const checkSSL = async (req, res) => {
  const { domain } = req.body;

  try {
    const options = {
      method: 'GET',
      host: domain,
      port: 443,
      path: '/',
      agent: false,
      rejectUnauthorized: false,
    };

    const req = https.request(options, (response) => {
      const cert = response.socket.getPeerCertificate();

      if (!cert || Object.keys(cert).length === 0) {
        return res.status(400).json({ error: 'No certificate found' });
      }

      const expirationDate = new Date(cert.valid_to);
      const isExpired = expirationDate < new Date();

      const certificateInfo = {
        validityStatus: isExpired ? 'Expired' : 'Valid',
        expirationDate: cert.valid_to,
        issuer: cert.issuer,
        subject: cert.subject,
        domainValidity: (cert.subject.CN === `*.${domain}` || cert.subject.CN === domain) ? 'Valid' : 'Invalid',
      };

      res.json(certificateInfo);
    });

    req.on('error', (e) => {
      res.status(500).json({ error: `Request failed: Not Found Domain` });
    });

    req.end();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while checking the SSL certificate' });
  }
};

module.exports = {
  checkSSL
};