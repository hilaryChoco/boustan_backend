const express = require('express');
const router = express.Router();
const userRoute = require('./user.route');
const categoryRoute = require('./category.route');
const elementRoute = require('./element.route');
const optionRoute = require("./option.route");
const mealRoute = require("./meal.route");


const defaultRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/elements',
    route: elementRoute,
  },
  {
    path: '/options',
    route: optionRoute,
  },
  {
    path: '/meals',
    route: mealRoute,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;