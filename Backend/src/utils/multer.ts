import multer from 'multer'
import path   from 'path'
import fs from 'fs'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '../public/uploads');
      
      
  
      // Ensure directory exists
      fs.mkdirSync(uploadPath, { recursive: true });
  
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + '_' + file.originalname;
      cb(null, fileName);
    }
  });

const  upload = multer({ storage: storage });

export default upload