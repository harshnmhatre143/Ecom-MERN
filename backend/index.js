
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDb = require("./config/db");

dotenv.config();
connectDb();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("The backend is working!");
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes.js'));
app.use('/api/orders', require('./routes/orderRoutes.js'));
app.use('/api/payment', require('./routes/paymentRoutes.js'));
app.use('/api/analytics', require('./routes/analyticsRoutes.js'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.use((req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('ShopNest API is running in Development mode...');
    });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
