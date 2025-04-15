import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import employeesRoutes from './routes/employees.js';
import "dotenv/config";
import connectDB from './connect.js';

const PORT = process.env.PORT || 8001;
const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/employee", employeesRoutes);

app.listen(PORT, () => {
    console.log("Server Started!", PORT);
});


