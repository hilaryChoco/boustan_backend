const express = require('express');
const router = express.Router();
const productRoute = require('./product.route');


const defaultRoutes = [
  {
    path: '/products',
    route: productRoute,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;