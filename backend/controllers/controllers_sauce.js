const Sauce = require("../models/models_sauce"); //Utilise le modèle de sauce
const fs = require("fs"); //Package file system qui permet de modifier ou supprimer des fichiers

exports.createSauce = (request, response, next) => {
  const sauceObject = JSON.parse(request.body.sauce); 
  const sauce = new Sauce({
    ...sauceObject, //...opérateur spread pour faire une copie de tous les éléments 
    imageUrl: `${request.protocol}://${request.get("host")}/images/${request.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [], //tableau d'id des users qui like
    usersDisliked: [], //tableau d'id des users qui dislike
  });

  sauce.save()
    .then(() => response.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => response.status(400).json({ error }));
};

exports.updateSauce = (request, response, next) => {
  const sauceObject = request.file ? { ...JSON.parse(request.body.sauce), //la requête update contient-elle un nouveau fichier ?
        imageUrl: `${request.protocol}://${request.get("host")}/images/${request.file.filename}`,
      } : { ...request.body };
  if (request.file) {
    Sauce.findOne({ _id: request.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne({ _id: request.params.id },{ ...sauceObject, _id: request.params.id })
            .then(() => {
              response.status(200).json({ message: "Sauce mise à jour!" });
            })
            .catch((error) => {
              response.status(400).json({ error: error });
            });
        });
      })
      .catch((error) => {
        response.status(500).json({ error });
      });
  } else {
    Sauce.updateOne({ _id: request.params.id },{ ...sauceObject, _id: request.params.id })
      .then(() => response.status(200).json({ message: "Sauce modifiée !" }))
      .catch((error) => response.status(400).json({ error }));
  }
};

exports.deleteSauce = (request, response, next) => {
  Sauce.findOne({ _id: request.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; 
      fs.unlink(`images/${filename}`, () => { //supprime également l'image de la base de données
        Sauce.deleteOne({ _id: request.params.id })
          .then(() => response.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => response.status(400).json({ error }));
      });
    })
    .catch((error) => response.status(500).json({ error }));
};

exports.getOneSauce = (request, response, next) => {
  Sauce.findOne({ _id: request.params.id })
    .then((sauce) => response.status(200).json(sauce))
    .catch((error) => response.status(404).json({ error }));
};

exports.getAllSauces = (request, response, next) => {
  Sauce.find()
    .then((sauces) => response.status(200).json(sauces))
    .catch((error) => response.status(404).json({ error }));
};

//requête POST des likes et dislikes
exports.likeSauce = (request, response, next) => {
  switch (request.body.like) {
    //annuler like et dislike
    case 0:
      Sauce.findOne({ _id: request.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find((user) => user === request.body.userId)) { //comparaison avec l'user id car il est le seul à pouvoir agir sur ses likes
            Sauce.updateOne({ _id: request.params.id },
              {
                $inc: { likes: -1 }, //enlève son like 
                $pull: { usersLiked: request.body.userId }, // retire le user id du tableau des likes
                _id: request.params.id,
              })
              .then(() => {
                response.status(200).json({ message: "Votre avis a été supprimé" });
              })
              .catch((error) => {
                response.status(400).json({ error: error });
              });
          }
          if (sauce.usersDisliked.find((user) => user === request.body.userId)) { //comparaison avec l'user id car il est le seul à pouvoir agir sur ses dislikes
            Sauce.updateOne({ _id: request.params.id },
              {
                $inc: { dislikes: -1 }, //enlève son dislike 
                $pull: { usersDisliked: request.body.userId }, // retire le user id du tableau des dislikes
                _id: request.params.id,
              })
              .then(() => {
                response.status(200).json({ message: "Votre avis a été supprimé" });
              })
              .catch((error) => {
                response.status(400).json({ error: error });
              });
          }
        })
        .catch((error) => {
          response.status(404).json({ error: error });
        });
      break;

    //like
    case 1:
      Sauce.updateOne({ _id: request.params.id },
        {
          $inc: { likes: 1 }, //ajoute un like
          $push: { usersLiked: request.body.userId }, //ajoute le user id dans le tableau des likes
          _id: request.params.id,
        })
        .then(() => {
          response.status(200).json({ message: "Merci ! Votre avis a été pris en compte" });
        })
        .catch((error) => {
          response.status(400).json({ error: error });
        });
      break;

    //dislike
    case -1:
      Sauce.updateOne({ _id: request.params.id },
        {
          $inc: { dislikes: 1 }, //ajoute un dislike
          $push: { usersDisliked: request.body.userId }, //ajoute le user id dans le tableau des dislikes
          _id: request.params.id,
        })
        .then(() => {
          response.status(200).json({ message: "Merci ! Votre avis a été pris en compte!" });
        })
        .catch((error) => {
          response.status(400).json({ error: error });
        });
      break;
    default:
      console.error("Erreur");
  }
};