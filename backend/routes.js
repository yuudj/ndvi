const router = require('express').Router();
const four0four = require('./utils/404')();

//cosas de autenticacion

//router.post('/login', ctrlAuth.login);



router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

/////////////
