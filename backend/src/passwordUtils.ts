/* eslint-disable prettier/prettier */
import bcrypt from 'bcrypt';

const saltRounds = 10;
// hash password with 10 salt rounds
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

// compare passwords
export const comparePasswords = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};