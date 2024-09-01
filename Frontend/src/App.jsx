import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [domain, setDomain] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const checkSSL = async () => {
        try {
            if(!domain){
                setError("Please type the Domain");
                return;
            }       
            const response = await axios.post('https://ssl-certification-checker-backend.onrender.com/v1/ssl/check', {
                domain: domain
            });
            console.log(response, "Response of the SSL Certificate");
            setResult(response.data.certificate);
            setError('');
        } catch (err) {
            setError(`An error occurred while checking the SSL certificate, ${err?.response?.data?.error}`);
            setResult(null);
        }
    };

    const formatKeyValuePairs = (obj) => {
        return Object.entries(obj).map(([key, value]) => `${key}: ${value}`).join(', ');
    };
      
    return (
        <div className="App">
            <h1>SSL Certificate Checker</h1>
            <input
                className="domain-input"
                type="text"
                placeholder="Enter domain name"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
            />
            <button onClick={checkSSL}>Check SSL</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}

{result && (
                <div className="result-container">
                    <h2>Certificate Details</h2>
                    <div className="result-section">
                        <h3>Validity Status</h3>
                        <p>{result.isCurrentlyValid}</p>
                    </div>
                    <div className="result-section">
                        <h3>Expiration Date</h3>
                        <p>{new Date(result.validTo).toLocaleString()}</p>
                    </div>
                    <div className="result-section">
                        <h3>Issuer</h3>
                        {formatKeyValuePairs(result.issuer)}
                    </div>
                    <div className="result-section">
                        <h3>Subject</h3>
                        {formatKeyValuePairs(result.subject)}
                    </div>
                    <div className="result-section">
                        <h3>Domain Validity</h3>
                        <p>{result.validForDomain}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
