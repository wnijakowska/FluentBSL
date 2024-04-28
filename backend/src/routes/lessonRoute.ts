/* eslint-disable prettier/prettier */

import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';


interface Task {
  TaskID: string;
  TaskName: string;
  VideoNames : string;
  VideoPaths : string;
  QuestionIDs : string;
  Category : string;
}

const lessonRouter = express.Router();

const lessonRoute = (db: sqlite3.Database) => {
  // response for post request
  lessonRouter.post('/', async (req: Request, res: Response) => {
    try {
      // sql query that selects all from the tasks table where taskid is the same as in the request
      const sql = 'SELECT * FROM tasks WHERE TaskID = ?';
      const params = [parseInt(req.body.taskID)];
      console.log('quiz router',params);
      db.get(sql, params, async function (err, row : Task) {
        try{
            if (err) {
              console.error('Database error:', err);
              return res.status(500).send('Database error');
            }
            if (row){
                console.log(row);
            // json response with all task data
            const responseJson = {
              TaskID : row.TaskID,
              TaskName : row.TaskName,
              VideoNames : row.VideoNames,
              VideoPaths : row.VideoPaths,
              QuestionIDs : row.QuestionIDs.split(','),
            }
            res.status(200).json(responseJson);
            }
        } catch (error) {
            console.error('Error with database:', error);
            res.status(500).send('Database error');
        }
      });
    } catch (error) {
      console.error('Error with server:', error);
      res.status(500).send('Internal server error');
    }
  });

  return lessonRouter;
};

export default lessonRoute;







