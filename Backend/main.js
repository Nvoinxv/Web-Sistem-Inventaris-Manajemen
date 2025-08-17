require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const database = require("../Backend/database/db");
const errorHandler = require("../Backend/Middleware/errorHandler");
const authRoutes = require("../Backend/Routers/Auth_route");
const barangRoutes = require("../Backend/Routers/Barang_route");
const PengadaanRoutes = require("../Backend/Routers/Pengadaan_route");

database();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Backend berhasil berjalan dengan lancar!");
}) 

app.use('/api/auth', authRoutes);
app.use("/api/pengadaan", PengadaanRoutes);
app.use('/api/barang', barangRoutes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});