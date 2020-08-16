const multer = require('multer');
const multer_config = {

    //specify diskStorage (another option is memory)
    storage: multer.diskStorage({

      //specify destination
      destination: function(req, file, next){
        next(null, './public/assets/photo-storage');
      },

      //specify the filename to be unique
      filename: function(req, file, next){
        //console.log(file);
        //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
        const ext = file.mimetype.split('/')[1];
        //set the file fieldname to a unique name containing the original name, current datetime and the extension.
        next(null, file.fieldname + '-' + Date.now() + '.' + ext);
      }
    }),

    // filter out and prevent non-image files.
    fileFilter: function(req, file, next){
          if(!file){
            next();
          }

        // only permit image mimetypes
        const image = file.mimetype.startsWith('image/');
        if(image){
          //console.log('photo uploaded');
          next(null, true);
        }else{
          //console.log("file not supported")
          //TODO:  A better message response to user on failure.
          return next();
        }
    }
  };

  module.exports = multer(multer_config);