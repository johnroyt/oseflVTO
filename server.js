const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
app.use(cors());

// Serve static files
app.use(express.static('public'));

// Add body parser middleware for JSON requests
app.use(express.json());

// Improved config endpoint with better error handling
app.get('/api/config', (req, res) => {
  const apiKey = process.env.FITMIX_API_KEY;
  
  if (!apiKey) {
    console.error('ERROR: FITMIX_API_KEY is not set in environment variables');
    return res.status(500).json({ 
      error: 'Server configuration error: API key missing',
      details: 'Make sure FITMIX_API_KEY is set in your .env file'
    });
  }
  
  try {
    res.json({
      apiKey: apiKey, // Send the API key to the client
      endpoint: 'https://vto-advanced-integration-api.fittingbox.com',
      proxyPath: '/api/vto'
    });
  } catch (error) {
    console.error('Error in /api/config route:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Improved proxy middleware
app.use('/api/vto', createProxyMiddleware({
  target: 'https://vto-advanced-integration-api.fittingbox.com',
  changeOrigin: true,
  pathRewrite: {'^/api/vto': ''},
  onProxyReq: (proxyReq, req, res) => {
    // Get the API key from environment
    const apiKey = process.env.FITMIX_API_KEY;
    if (!apiKey) {
      console.error('ERROR: FITMIX_API_KEY is missing for proxy request');
      return;
    }
    
    // Add API key as query parameter
    const parsedUrl = new URL(proxyReq.path, 'https://vto-advanced-integration-api.fittingbox.com');
    parsedUrl.searchParams.set('apiKey', apiKey);
    proxyReq.path = parsedUrl.pathname + parsedUrl.search;
  }
}));

// Add a route for updating patient PD
app.post('/api/update-pd', (req, res) => {
  const { pd } = req.body;
  
  // Server-side validation
  const pdValue = parseInt(pd);
  if (isNaN(pdValue) || pdValue < 50 || pdValue > 80) {
    return res.status(400).json({ 
      error: 'Invalid PD value. Must be between 50-80mm.' 
    });
  }
  
  // Save to database or use in subsequent API calls if needed
  // For now, just return success
  return res.json({ 
    success: true, 
    message: 'PD updated successfully',
    pd: pdValue
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key configured: ${process.env.FITMIX_API_KEY ? 'YES' : 'NO - Check your .env file!'}`);
});