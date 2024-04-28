/* eslint-disable prettier/prettier */

import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';

interface Question {
  ID: string;
  VideoPath: string;
  Choices: string;
  Answer: string;
}
const quizRouter = express.Router();

const quizRoute = (db: sqlite3.Database) => {
  // response for post request
  quizRouter.post('/', async (req: Request, res: Response) => {
    try {
      // sql query that select all data from questions table where the ID is same as sent in post request
      const sql = 'SELECT * FROM questions WHERE ID = ?';
      const questionArray: Array<Object> = [];

      for (const id of req.body.questionIDs) {
        const qRow : Question = await new Promise((resolve, reject) => {
          db.get(sql, [parseInt(id)], (err, row : Question) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
        // if qRow is not null, add data from questions table to questionArray
        if (qRow) {
          questionArray.push({
            ID: qRow.ID,
            VideoPath: qRow.VideoPath,
            Choices: qRow.Choices.split(','),
            Answer: qRow.Answer,
          });
        }
      }

      console.log(questionArray);
      res.status(200).json({ questions: questionArray });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  });

  return quizRouter;
};

export default quizRoute;




