const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Make sure cors is imported
const {connectDB} = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Body parser
app.use(express.json());

// --- API Routes ---

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/viewers', require('./routes/viewerRoutes')); 



app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));