const express = require ("express"); //importation d' Express
const router = express.Router(); //Importation du router Express
const bouncer = require ("express-bouncer")(15000, 900000, 3); //Importation de bouncer qui permet de contrer les attaques de force brute.
//Si mot de passe erronné au bout de 3 fois, il y a un délai compris entre 15s et 15mn avant de pouvoir se reconnecter.

const userCtrl = require("../controllers/controllers_user");//importation logique métier - controller user

router.post("/signup", userCtrl.signup);
router.post("/login", bouncer.block, userCtrl.login);


module.exports = router;