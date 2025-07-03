const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 5001;

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'ecommerce'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database');

  db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (!err) console.log('Orders table ready');
  });
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  db.query('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.send('Error loading messages');

    let html = `
      <h2>📝 Shows your tech stack—Node.js + MySQL.  🔥</h2>
      <form method="POST" action="/submit">
        <input type="text" name="message" placeholder="Type your message..." required />
        <button type="submit">Submit</button>
      </form><hr />
    `;

    rows.forEach(row => {
      html += `<p><b>📥</b> ${row.message}</p>`;
    });

    res.send(html);
  });
});

app.post('/submit', (req, res) => {
  const message = req.body.message;
  db.query('INSERT INTO orders (message) VALUES (?)', [message], (err) => {
    if (err) console.log('Insert failed:', err);
    res.redirect('/');
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Order service running on http://0.0.0.0:${PORT}`);
});
