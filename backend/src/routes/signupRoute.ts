/* eslint-disable prettier/prettier */

import express, { Request, Response } from 'express';
import { hashPassword } from '../passwordUtils'; // Import the hashPassword function
import sqlite3 from 'sqlite3';

const sgrouter = express.Router();

// define the function to add CORS headers
const cors_flight_response = (res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  return res;
};

const signupRoute = (db: sqlite3.Database) => {
  // repsonse for a post request
  sgrouter.post('/', async (req: Request, res: Response) => {
    try {
      const { username, password, email } = req.body;
      const hashedPassword = await hashPassword(password); // hash the password
      // save the username and hashed password to database
      const sql = 'INSERT INTO logins (username, email, password) VALUES (?, ?, ?)';
      const params = [username, email, hashedPassword];
      db.run(sql, params, function (err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }
        // add CORS headers to the response
        res = cors_flight_response(res);
        db.run("INSERT INTO trackers (TaskIDs, streak, DayOfLastTask) VALUES ('',0, date('now', '-1 day')");
        res.status(201).send('User signed up successfully!');
      });
    } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).send('Internal server error');
    }
  });

  return sgrouter;
};

export default signupRoute;
