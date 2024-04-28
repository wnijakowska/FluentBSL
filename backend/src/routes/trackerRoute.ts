/* eslint-disable prettier/prettier */

import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';

interface userInfo {
  TaskIDs: string;
  streak: string;
  DayOfLastTask : string;
  Username : string;
  Email : string;
}

const trackerRouter = express.Router();

const trackerRoute = (db: sqlite3.Database) => {
  // response for a post request
  trackerRouter.post('/', async (req: Request, res: Response) => {
    try {
      // sql query for retrieving data from trackers table
      const sql = 'SELECT trackers.TaskIDs, trackers.streak, trackers.DayOfLastTask, logins.Username, logins.Email FROM trackers INNER JOIN logins ON logins.UUID =trackers.UUID WHERE logins.UUID = ?';
      const params = [parseInt(req.body.UUID)];
      db.get(sql, params, async function (err, row : userInfo) {
        try{
            if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
            }
            // set data in json response to data retrieved from trackers table
            res.status(200).json({
                TaskIDs: row.TaskIDs,
                streak: row.streak,
                DayOfLastTask : row.DayOfLastTask,
                Username : row.Username,
                Email : row.Email ,
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Database error');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  });

  return trackerRouter;
};

export default trackerRoute;

