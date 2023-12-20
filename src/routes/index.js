const express = require('express');
const router = express.Router();
const userRoute = require('./user.route');
const categoryRoute = require('./category.route');
const optionRoute = require("./option.route");
const mealRoute = require("./meal.route");
const imageUploadRoute = require("./imageUpload.route");
const branchRoute = require("./branch.route");
const orderRoute = require("./order.route");
const adminRoute = require("./admin.route");
const rewardRoute = require("./reward.route");


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
    path: '/options',
    route: optionRoute,
  },
  {
    path: '/meals',
    route: mealRoute,
  },
  {
    path: '/uploads',
    route: imageUploadRoute,
  },
  {
    path: '/branches',
    route: branchRoute
  },
  {
    path: '/orders',
    route: orderRoute
  },
  {
    path: '/admins',
    route: adminRoute
  },
  {
    path: '/rewards',
    route: rewardRoute
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;