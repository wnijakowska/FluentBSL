/* eslint-disable prettier/prettier */

import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';

interface Task {
  TaskID: number;
  TaskName: string;
}

const tasksRouter = express.Router();

const tasksRoute = (db: sqlite3.Database) => {
  // response for a post request
  tasksRouter.post('/', async (req: Request, res: Response) => {
    try {
      // sql query to retreive data from tasks table where category is what is sent in post request
      const sql = 'SELECT TaskID, TaskName FROM tasks WHERE Category LIKE ?';
      const params = [req.body.category];
      db.all(sql, params, async function (err, rows: Array<Task>) {
        try{
            if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
            }
            // json response that sends corresponding taskID and taskName
            const respJSON : {[id: string] : Task} = {};
            for (let i = 0; i < rows.length; i++) {
              respJSON[i.toString()] = {
                TaskID : rows[i].TaskID,
                TaskName : rows[i].TaskName,
              };
            }
            res.status(200).json(respJSON);

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

  return tasksRouter;
};

export default tasksRoute;







