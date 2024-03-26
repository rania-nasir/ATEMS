const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    // Assuming that the roll number of the student is available in the request body as 'rollNumber'
    const rollNumber = req.userId;
    if (!rollNumber) {
      return cb(new Error('Roll number is required.'));
    }
    // Rename the file to the roll number of the student
    cb(null, rollNumber + '.pdf'); // Use the roll number as the file name for the uploaded file
  }
});

// Restrict file types
const fileFilter = (req, file, cb) => {
    // PDF file mimetypes
    if (['application/pdf', 'application/octet-stream', 'application/x-pdf'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
    }
};

// Create the multer instance with the configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit the file size to 5MB
  }
}).single('thesisTwoReportFile'); // 'thesisTwoReportFile' is the name of the field in the form for file upload


const uploadThesisTwoReport = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error during file upload
          console.error('Multer error:', err);
          return res.status(400).json({ error: 'File upload error' });
        } else if (err) {
          // An unknown error occurred
          console.error('Unknown error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        const rollNumber = req.userId; 
        if (rollNumber && req.file) {
          const fileName = req.file.originalname; // Get the original file name
          const expectedFileName = rollNumber + '.pdf'; // Generate the expected file name
          if (fileName !== expectedFileName) {
            // File name does not match roll number
            return res.status(400).json({ message: 'File name should be the same as your roll number' });
          }
        }
        next(); // Move to the next middleware
      });
  };

module.exports = { uploadThesisTwoReport };
