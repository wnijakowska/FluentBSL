/* eslint-disable prettier/prettier */

import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';

interface TaskList {
  TaskIDs: string;
}

const progressRouter = express.Router();

const progressRoute = (db: sqlite3.Database) => {
  // response for post request
  progressRouter.post('/', async (req: Request, res: Response) => {
    try {
      // sql query that selects taskids from trackers table where uuid is the same as from the post request
      const sql = 'SELECT TaskIDs FROM trackers WHERE UUID = ?';
      const params = [parseInt(req.body.UUID)];
      db.get(sql, params, async function (err, row : TaskList) {
        try{
            if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
            }
            res.status(200).send(row.TaskIDs);

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

  return progressRouter;
};

export default progressRoute;







