const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shaik123',
    database: 'event_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database');
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`
        <h1>Event Registration Form</h1>
        <form action="/submit_registration" method="POST">
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" required><br><br>
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br><br>
            <label for="phone">Phone:</label><br>
            <input type="text" id="phone" name="phone" required><br><br>
            <label for="event">Event:</label><br>
            <select id="event" name="event" required>
                <option value="">Select an event</option>
                <option value="event1">Event 1: Workshop</option>
                <option value="event2">Event 2: Seminar</option>
                <option value="event3">Event 3: Conference</option>
            </select><br><br>
            <button type="submit">Submit</button>
        </form>
    `);
});

app.post('/submit_registration', (req, res) => {
    const { name, email, phone, event } = req.body;
    const query = 'INSERT INTO registrations (name, email, phone, event) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, phone, event], (err, result) => {
        if (err) return res.status(500).send('Error inserting data');
        res.send('Registration successful');
    });
});

app.get('/registrations', (req, res) => {
    const query = 'SELECT * FROM registrations';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send('Error fetching data');
        
        let html = `<h1>Registrations</h1><table border="1">
                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Event</th></tr>`;
        
        results.forEach(row => {
            html += `<tr><td>${row.id}</td><td>${row.name}</td><td>${row.email}</td><td>${row.phone}</td><td>${row.event}</td></tr>`;
        });
        
        html += '</table>';
        res.send(html);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
