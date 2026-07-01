// test-upload.js — put this in /server/
require('dotenv').config();
const cloudinary = require('./config/cloudinary');

cloudinary.uploader.upload('./test.pdf', {
  folder: 'portfolio/test',
  resource_type: 'image',
  format: 'pdf',
  public_id: `resume_test_${Date.now()}`,
}).then(result => {
  console.log('SUCCESS');
  console.log('URL:', result.secure_url);
  console.log('resource_type:', result.resource_type);
  console.log('format:', result.format);
}).catch(err => {
  console.log('ERROR:', err.message);
});