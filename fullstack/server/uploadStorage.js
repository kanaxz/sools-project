var multer  = require('multer')
var uploadStorage = multer({ dest: 'uploads/' });
module.exports = uploadStorage;