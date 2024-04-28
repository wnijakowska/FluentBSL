/* eslint-disable prettier/prettier */

import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';

const completedTaskRouter = express.Router();

const completedTaskRoute = (db: sqlite3.Database) => {
  completedTaskRouter.post('/', async (req: Request, res: Response) => {
    //sql query to update tasks and streaks (explained in detail in my report)
    try {
      const sql = `WITH RECURSIVE Splitter AS (
        SELECT
          SUBSTR(taskIDs, 1, INSTR(taskIDs || ',', ',') - 1) AS taskID,
          SUBSTR(taskIDs, INSTR(taskIDs || ',', ',') + 1) AS remaining_taskIDs
        FROM trackers
        WHERE UUID = ?
      
        UNION ALL
      
        SELECT
          SUBSTR(remaining_taskIDs, 1, INSTR(remaining_taskIDs || ',', ',') - 1),
          SUBSTR(remaining_taskIDs, INSTR(remaining_taskIDs || ',', ',') + 1)
        FROM Splitter
        WHERE remaining_taskIDs != ''
      )
      UPDATE trackers
      SET
        taskIDs = CASE
          WHEN taskIDs IS NULL THEN ?
          WHEN NOT EXISTS (
            SELECT 1
            FROM Splitter
            WHERE taskID = ?
          ) THEN taskIDs || ',' || ?
          ELSE taskIDs
        END,
        streak = CASE
          WHEN DayOfLastTask = date('now', '-1 day') THEN streak + 1
          WHEN DayOfLastTask = date('now') THEN streak
          ELSE 0
        END,
        DayOfLastTask = CASE
          WHEN DayOfLastTask < date() THEN date()
          ELSE DayOfLastTask
        END
      WHERE UUID = ?`;
      const params = [parseInt(req.body.UUID),req.body.taskID, req.body.taskID, req.body.taskID, parseInt(req.body.UUID)];
      db.run(sql, params, function (err) {
        if (err) {
            return console.error(err.message);
          }
          console.log(`Row(s) updated: ${this.changes}`);
          res.status(200).send("row updated");
      });
    } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).send('Internal server error');
    }
  });

  return completedTaskRouter;
};

export default completedTaskRoute;







