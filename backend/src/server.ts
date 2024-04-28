/* eslint-disable prettier/prettier */
import express, { Express, Request, Response, NextFunction } from 'express';
import lgrouter from './routes/loginRoute';
import sgrouter from './routes/signupRoute';
import tasksRouter from './routes/tasksRoute';
import progressRouter from './routes/progressRoute';
import lessonRouter from './routes/lessonRoute';
import quizRouter from './routes/quizRoute';
import trackerRouter from './routes/trackerRoute';
import completedTaskRouter from './routes/completedTaskRoute';
import sqlite3 from 'sqlite3';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000');

// middleware to parse JSON requests
app.use(cors());
app.use(express.static('public'));


app.use(bodyParser.json());

// directives for csp
app.use(
  helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'none'"],
         styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
         fontSrc: ["'self'", 'https://fonts.gstatic.com'],
         scriptSrc: ["'self'", "'unsafe-inline'"],
         imgSrc: ["'self'", 'http://localhost:3000'],
       },
     },
  })
 );
// test
app.get('/', (req, res) => {
  res.send('Hello World!');
})

// Initialize SQLite database
const db: sqlite3.Database = new sqlite3.Database('./db/database.db');

// routes
app.use('/login', lgrouter(db));
app.use('/signup', sgrouter(db));
app.use('/tasks', tasksRouter(db));
app.use('/progress', progressRouter(db));
app.use('/getLesson', lessonRouter(db));
app.use('/getQuiz', quizRouter(db));
app.use('/getTracker', trackerRouter(db)); 
app.use('/completeTask', completedTaskRouter(db));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Error');
});


// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
