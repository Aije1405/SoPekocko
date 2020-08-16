const multer = require("multer"); //Package qui permet de gérer les fichiers images entrants dans les requêtes HTTP

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
  };

const storage = multer.diskStorage ({destination: (request, file, callback) => { //Paramètre la destination d'enregistrement des fichiers
    callback(null, "images");
    },
    filename: (request, file, callback) => { //Paramètre la méthode de nom des fichiers
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});


module.exports = multer({storage }).single('image');