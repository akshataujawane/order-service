const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: 'order-db',
  user: 'admin',
  password: 'admin',
  database: 'orders_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ DB Connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL (orders_db)');
});

app.get('/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/orders', (req, res) => {
  const { product_name, quantity } = req.body;
  db.query(
    'INSERT INTO orders (product_name, quantity) VALUES (?, ?)',
    [product_name, quantity],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, product_name, quantity });
    }
  );
});

app.listen(4000, () => {
  console.log('🚀 Order service running on port 4000');
});
