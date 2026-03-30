const express = require('express');
const path = require('path');
const dal = require('./dal');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
}

app.get('/account/create/:name/:email/:password/:balance', async (req, res) => {
  const { name, email, password, balance } = req.params;
  const parsedBalance = toNumber(balance);

  if (!name || !email || !password || Number.isNaN(parsedBalance)) {
    return res.status(400).json({ error: 'Invalid account payload' });
  }

  try {
    const user = await dal.create(name, email, password, parsedBalance);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/account/update/:email/:amount', async (req, res) => {
  const { email, amount } = req.params;
  const parsedAmount = toNumber(amount);

  if (!email || Number.isNaN(parsedAmount)) {
    return res.status(400).json({ error: 'Invalid update payload' });
  }

  try {
    const result = await dal.update(email, parsedAmount);
    if (!result) {
      return res.status(404).json({ error: 'Account not found' });
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/account/findOne/:email', async (req, res) => {
  try {
    const user = await dal.findOne(req.params.email);
    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/account/all', async (_req, res) => {
  try {
    const users = await dal.all();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`BadBank server running on http://localhost:${port}`);
});
