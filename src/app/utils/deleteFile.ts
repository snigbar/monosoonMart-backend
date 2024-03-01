import fs from 'fs';
import AppError from '../Errors/AppError';

export const deleteFile = (path: string) => {
  fs.unlink(path, (err) => {
    if (err) {
      throw new AppError('user already exists but failed to delete file', 403);
    }
    // to remove
    console.log('File deleted successfully');
  });
};
