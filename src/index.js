const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from CI/CD Practice App! 🚀',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/add/:a/:b', (req, res) => {
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Parameters must be valid numbers' });
  }

  res.json({ result: add(a, b) });
});

function add(a, b) {
  return a + b;
}

// --- SONARCLOUD TEST ROUTE ---
app.get('/admin', (req, res) => {
  // MAJOR VULNERABILITY: Hardcoded secrets
  const adminPassword = "SuperSecretPassword123!";
  
  // CODE SMELL: Unused variable
  // eslint-disable-next-line no-unused-vars
  let unusedData = "This variable is literally never used anywhere";
  
  // BUG & CODE SMELL: Redundant boolean comparison and confusing logic
  // eslint-disable-next-line no-constant-condition
  if (true === true) {
    if (adminPassword != null) {
      // eslint-disable-next-line no-console
      console.log("Admin trying to log in...");
    }
  }

  // BUG: Missing proper response headers or authentication
  res.send("Welcome Admin! Password is: " + adminPassword);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, add };
