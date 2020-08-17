const jwt = require("jsonwebtoken"); //Importation de jsnwebtoken pour le système de jetons d'authentification

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1]; //Récupération du token provenant du header authorization de la requête 
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); //Fonction pour décoder le token
    const userId = decodedToken.userId; //récupération du user ID
    if (request.body.userId && request.body.userId !== userId) { //Si user Id de la requête différent du userId du token
      throw "User ID non valable";
    } else {
      next();
    }
  } catch (error) {
    response.status(401).json({ error: error | "Requête non authentifiée !" });
  }
};