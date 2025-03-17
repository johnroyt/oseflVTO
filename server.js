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

app.get('/api/config', (req, res) => {
    // Only provide an endpoint, not the actual API key
    res.json({
      endpoint: 'https://vto-advanced-integration-api.fittingbox.com',
      proxyPath: '/api/vto'
    });
  });
  
  // Modify your proxy setup to handle API key as a query param instead of header
  app.use('/api/vto', createProxyMiddleware({
    target: 'https://vto-advanced-integration-api.fittingbox.com',
    changeOrigin: true,
    pathRewrite: {'^/api/vto': ''},
    router: (req) => {
      // Add API key as query parameter to the target URL
      return `https://vto-advanced-integration-api.fittingbox.com?apiKey=${process.env.FITMIX_API_KEY}`;
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
});