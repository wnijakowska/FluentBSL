/* eslint-disable prettier/prettier */

import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';

interface User {
  Password: string;
  Username: string;
  UUID: number; 
}

const lgrouter = express.Router();

const cors_flight_response = (res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  return res;
};

const loginRoute = (db: sqlite3.Database) => {
  // response for post request
  lgrouter.post('/', async (req: Request, res: Response) => {
    try {
      // retreieve username and password from request
      const { username, password } = req.body;
      //sql queries that selects uuid, username and password from logins table where username is same as in the request
      const sql = 'SELECT UUID, Username, Password FROM logins WHERE Username LIKE ?';
      const params = [username];
      db.get(sql, params, async function (err, row: User) {
        try{
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }
        //if there are no rows matching, username or password is incorrect
        if (!row){
          return res.status(401).send('Invalid username or password');
        }
        // if theres a row, call bcrypt to compare the passwords and set to match
        const match = await bcrypt.compare(password, row.Password);
        // if match is true, send username and uuid
        if (match) {
          return res.status(201).send({'username' : row.Username, 'UUID' : row.UUID });
        } else {
          return res.status(401).send('Invalid username or password');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Database error');
      }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  });

  return lgrouter;
};

export default loginRoute;







