require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const userRouter = require('./routes/User-Router');
const resumeRouter = require('./routes/Resume-Router');
const path = require('path');

// In CommonJS, __filename and __dirname are available by default
// So you can use them directly

const app = express();
const PORT = process.env.PORT || 5000;
// connectDB();
app.use(cors());
// app.use(cors({
// //   origin: ["http://localhost:5173"],
//   origin: process.env.FRONTEND_URL,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true // if you’re using cookies or auth headers
// }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Resume Builder Server is running');
});

app.use('/api/user', userRouter);
app.use('/api/resume', resumeRouter);

app.use('/upload', express.static(path.join(process.cwd(), 'upload'),
{
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    }
}
));

//Connect to DB and start server

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
