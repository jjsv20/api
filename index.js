require('dotenv').config();
const { connectDB } = require('./db/db-Connection');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000

app.use(cors());
connectDB();

app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
