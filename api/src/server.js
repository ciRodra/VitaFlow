require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');
const historyRoutes = require('./routes/history');
const progressRoutes = require('./routes/progress');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);     // Lucas adiciona aqui o PUT/DELETE /tasks/:id/record (2C)
app.use('/history', historyRoutes);
app.use('/progress', progressRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`VitaFlow API rodando em http://localhost:${PORT}`));

module.exports = app;
