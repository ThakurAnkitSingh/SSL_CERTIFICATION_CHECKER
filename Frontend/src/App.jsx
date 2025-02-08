import { useState } from 'react';
import axios from 'axios';
import { useTheme } from './context/ThemeContext';
import { FaMoon, FaSun, FaHistory } from 'react-icons/fa';
import './App.css';

function App() {
    const [domain, setDomain] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('sslHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const { darkMode, toggleTheme } = useTheme();

    const saveToHistory = (domain, result) => {
        const newHistory = [{ domain, result, timestamp: new Date().toISOString() }, ...history.slice(0, 9)];
        setHistory(newHistory);
        localStorage.setItem('sslHistory', JSON.stringify(newHistory));
    };

    const checkSSL = async () => {
        try {
            if(!domain) {
                setError("Please enter a domain");
                return;
            }
            
            setLoading(true);
            setError('');
            
            let processedDomain = domain;
            if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
                processedDomain = `https://${domain}`;
            }

            const response = await axios.post('http://localhost:3000/v1/ssl/check', {
                domain: processedDomain
            });
            
            const certData = response.data.certificate;
            setResult(certData);
            saveToHistory(domain, certData);
            
        } catch (err) {
            setError(`Error: ${err?.response?.data?.error || 'Failed to check SSL certificate'}`);
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const formatKeyValuePairs = (obj) => {
        if (!obj) return '';
        return Object.entries(obj).map(([key, value]) => `${key}: ${value}`).join(', ');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            checkSSL();
        }
    };

    return (
        <div className={`App ${darkMode ? 'dark' : 'light'}`}>
            <div className="header">
                <h1>SSL Certificate Checker</h1>
                <button 
                    className="theme-toggle" 
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>
            </div>

            <div className="input-container">
                <input
                    className="domain-input"
                    type="text"
                    placeholder="Enter domain name (e.g., example.com)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button 
                    className="check-button" 
                    onClick={checkSSL}
                    disabled={loading}
                >
                    {loading ? 'Checking...' : 'Check SSL'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {result && (
                <div className="result-container">
                    <h2>Certificate Details</h2>
                    <div className="result-grid">
                        <div className="result-section">
                            <h3>Status</h3>
                            <p className={`status ${result.isCurrentlyValid === 'True' ? 'valid' : 'invalid'}`}>
                                {result.isCurrentlyValid === 'True' ? 'Valid' : 'Invalid'}
                            </p>
                        </div>
                        
                        <div className="result-section">
                            <h3>Expiration</h3>
                            <p>{new Date(result.validTo).toLocaleDateString()}</p>
                        </div>

                        <div className="result-section">
                            <h3>Valid From</h3>
                            <p>{new Date(result.validFrom).toLocaleDateString()}</p>
                        </div>

                        <div className="result-section">
                            <h3>Domain Validity</h3>
                            <p className={result.validForDomain === 'True' ? 'valid' : 'invalid'}>
                                {result.validForDomain === 'True' ? 'Valid for domain' : 'Invalid for domain'}
                            </p>
                        </div>

                        <div className="result-section full-width">
                            <h3>Issuer</h3>
                            <p>{formatKeyValuePairs(result.issuer)}</p>
                        </div>

                        <div className="result-section full-width">
                            <h3>Subject</h3>
                            <p>{formatKeyValuePairs(result.subject)}</p>
                        </div>
                    </div>
                </div>
            )}

            {history.length > 0 && (
                <div className="history-container">
                    <h3><FaHistory /> Recent Checks</h3>
                    <div className="history-list">
                        {history.map((item, index) => (
                            <div key={index} className="history-item" onClick={() => setDomain(item.domain)}>
                                <span>{item.domain}</span>
                                <span className="history-date">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
