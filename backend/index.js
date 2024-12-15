import express from 'express';
// import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './controllers/error.controller.js';
import router from './routes/index.route.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Routes
app.use('/api', router);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(globalErrorHandler);

export default app;