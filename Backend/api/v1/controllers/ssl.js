const https = require('https');
const { exec } = require('child_process');
const tls = require('tls');
const dns = require('dns');
const { promisify } = require('util');

const dnsResolve = promisify(dns.resolve);

const validateDomain = (domain) => {
  try {
    const url = new URL(domain);
    return url.hostname;
  } catch (error) {
    // If URL parsing fails, check if it's a valid domain name
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain)) {
      return domain;
    }
    throw new Error('Invalid domain format');
  }
};

const getCipherInfo = (socket) => {
  const cipher = socket.getCipher();
  return {
    name: cipher.name,
    version: cipher.version,
    bits: cipher.bits
  };
};

const checkDNSRecords = async (hostname) => {
  try {
    const records = await Promise.all([
      dnsResolve(hostname, 'A').catch(() => []),
      dnsResolve(hostname, 'AAAA').catch(() => []),
      dnsResolve(hostname, 'MX').catch(() => []),
      dnsResolve(hostname, 'TXT').catch(() => [])
    ]);

    return {
      A: records[0],
      AAAA: records[1],
      MX: records[2],
      TXT: records[3]
    };
  } catch (error) {
    return { error: 'Failed to fetch DNS records' };
  }
};

const checkSSL = async (req, res) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const hostname = validateDomain(domain);
    const dnsRecords = await checkDNSRecords(hostname);

    const options = {
      host: hostname,
      port: 443,
      method: 'GET',
      rejectUnauthorized: false,
      servername: hostname // Required for SNI
    };

    const sslRequest = https.request(options, async (response) => {
      try {
        const socket = response.socket;
        const certificate = socket.getPeerCertificate(true);

        if (!certificate || Object.keys(certificate).length === 0) {
          return res.status(400).json({ error: 'No SSL certificate found' });
        }

        const now = new Date();
        const validFrom = new Date(certificate.valid_from);
        const validTo = new Date(certificate.valid_to);

        // Enhanced certificate details
        const certInfo = {
          subject: certificate.subject,
          issuer: certificate.issuer,
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          serialNumber: certificate.serialNumber,
          fingerprint: certificate.fingerprint,
          isCurrentlyValid: now >= validFrom && now <= validTo ? 'True' : 'False',
          validForDomain: certificate.subject.CN === hostname ? 'True' : 'False',
          daysUntilExpiry: Math.ceil((validTo - now) / (1000 * 60 * 60 * 24)),
          subjectAlternativeNames: certificate.subjectaltname ?
            certificate.subjectaltname.split(', ').map(name => name.replace('DNS:', '')) :
            [],
        };

        // Connection security details
        const connectionInfo = {
          protocol: socket.getProtocol(),
          cipher: getCipherInfo(socket),
          secureConnection: socket.encrypted ? 'True' : 'False',
        };

        // Check certificate chain
        const chainVerified = socket.authorized ? 'True' : 'False';

        // Compile response
        const response = {
          url: domain,
          certificate: {
            ...certInfo,
            chainVerified
          },
          connection: connectionInfo,
          dns: dnsRecords
        };

        res.json(response);
      } catch (error) {
        console.error('Error processing certificate:', error);
        res.status(500).json({ error: 'Error processing SSL certificate' });
      }
    });

    sslRequest.on('error', (error) => {
      console.error('SSL request error:', error);
      res.status(500).json({
        error: 'Failed to establish SSL connection',
        details: error.message
      });
    });

    sslRequest.end();

  } catch (error) {
    console.error('Controller error:', error);
    res.status(400).json({
      error: error.message || 'Failed to check SSL certificate',
      details: error.stack
    });
  }
};

module.exports = {
  checkSSL
};