const express = require('express');
const router = express.Router();
const { branchCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');


// -----------  GET ROUTES  -------------

/**
 * @swagger
 *  /api/branches:
 *      get:
 *          summary: Displays a list of branches
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: limit
 *                schema:
 *                  type: string
 *                description: Number of items
 *              - in: query
 *                name: page
 *                schema:
 *                  type: string
 *                description: Page number
 *              - in: query
 *                name: order
 *                schema:
 *                  type: string
 *                description: Sorting order ["asc", "desc"]
 *          responses:
 *              '200':
 *                description: >
 *                    Returns a list of branches
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/", isAuth, branchCtrl.getAll);

/**
 * @swagger
 *  /api/branches/meals:
 *      get:
 *          summary: Displays a list of meals for a branch
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                description: Branch ID
 *              - in: query
 *                name: limit
 *                schema:
 *                  type: string
 *                description: Number of items
 *              - in: query
 *                name: page
 *                schema:
 *                  type: string
 *                description: Page number
 *              - in: query
 *                name: order
 *                schema:
 *                  type: string
 *                description: Sorting order ["asc", "desc"]
 *          responses:
 *              '200':
 *                description: >
 *                    Returns a list of branch meals
 *              '404':
 *                description: >
 *                    Branch not found
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/meals", isAuth, branchCtrl.getBranchMeals);

/**
 * @swagger
 *  /api/branches/meals-by-category:
 *      get:
 *          summary: Displays a list of meals for a branch grouped by category
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                description: Branch ID
 *          responses:
 *              '200':
 *                description: >
 *                    Returns a list of branch meals
 *              '404':
 *                description: >
 *                    Branch not found
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/meals-by-category", isAuth, branchCtrl.getBranchMealsGroupedByCategory);

/**
 * @swagger
 *  /api/branches/near:
 *      get:
 *          summary: Get near-by branches
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: longitude
 *                schema:
 *                  type: number
 *                description: Longitude of the point
 *              - in: query
 *                name: latitude
 *                schema:
 *                  type: number
 *                description: Latitude of the point
 *          responses:
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/near", isAuth, branchCtrl.getNearByBranches);

// -----------  POST ROUTES  -------------

/**
 * @swagger
 *  /api/branches/create:
 *      post:
 *          summary: Creation of a branch
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  required: true
 *                              location:
 *                                  type: "object"
 *                                  properties:
 *                                      type:
 *                                          type: string
 *                                          required: true
 *                                      coordinates:
 *                                          type: array
 *                                          items:
 *                                              type: number
 *                              hours:
 *                                  type: array
 *                                  items:
 *                                      type: "object"
 *                                      properties:
 *                                          day:
 *                                              type: string
 *                                              required: true
 *                                          open:
 *                                              type: number
 *                                              required: true
 *                                          close:
 *                                              type: number
 *                                              required: true
 *                          example:
 *                              name: "Branch_1"
 *                              location: {
 *                                  type: "Point",
 *                                  coordinates: [-108, 41]
 *                              }
 *                              hours: {
 *                                  day: "Monday",
 *                                  open: 480,
 *                                  close: 1439
 *                              }
 *          responses:
 *              '201':
 *                description: >
 *                    Branch successfully created
 *              '500':
 *                  description: >
 *                    Server Error || Branch creation failure
 *
 */
router.post("/create", isAuth, branchCtrl.create);

// -----------  PUT ROUTES  -------------

/**
 * @swagger
 *  /api/branches/edit:
 *      put:
 *          summary: Modifies a branch
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Branch ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              location:
 *                                  type: "object"
 *                                  properties:
 *                                      type:
 *                                          type: string
 *                                          required: true
 *                                      coordinates:
 *                                          type: array
 *                                          items:
 *                                              type: number
 *                              hours:
 *                                  type: array
 *                                  items:
 *                                      type: "object"
 *                                      properties:
 *                                          day:
 *                                              type: string
 *                                              required: true
 *                                          open:
 *                                              type: number
 *                                              required: true
 *                                          close:
 *                                              type: number
 *                                              required: true
 *                          example:
 *                              location: {
 *                                  type: "Point",
 *                                  coordinates: [-109, 41]
 *                              }
 *                              hours: {
 *                                  day: "Monday",
 *                                  open: 480,
 *                                  close: 1439
 *                              }
 *          responses:
 *              '200':
 *                description: >
 *                    Branch successfully modified
 *              '404':
 *                description: >
 *                    Branch not found
 *              '500':
 *                  description: >
 *                    Server Error || An error occured during branch modification
 *
 */
router.put("/edit", isAuth, branchCtrl.edit);

/**
 * @swagger
 *  /api/branches/edit/meals:
 *      put:
 *          summary: Modifies a branch's available meals
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Branch ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              availableMeals:
 *                                  type: array
 *                                  items:
 *                                      type: "object"
 *                                      properties:
 *                                          mealId:
 *                                              type: string
 *                                              required: true
 *                                          inPromo:
 *                                              type: boolean
 *                                              required: true
 *                                          promoPrice:
 *                                              type: string
 *                                              required: false
 *                                          quantity:
 *                                              type: number
 *                                              required: true
 *                                          endPromoDate:
 *                                              type: string
 *                                              required: false
 *                          example:
 *                              availableMeals: [{
 *                                  mealId: "8952",
 *                                  inPromo: false,
 *                                  promoPrice: "1200",
 *                                  quantity: 6,
 *                                  endPromoDate: "2024/02/16",
 *                              }]
 *          responses:
 *              '200':
 *                description: >
 *                    Success setting branch available meals
 *              '404':
 *                description: >
 *                    Branch not found
 *              '500':
 *                  description: >
 *                    Server Error || Error setting branch available meals
 *
 */
router.put("/edit/meals", isAuth, branchCtrl.modifyAvailableMeals);

/**
 * @swagger
 *  /api/branches/edit/meals/quantity:
 *      put:
 *          summary: Modifies the quantity of an available meal
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: branchId
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Branch ID
 *              - in: query
 *                name: mealId
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Meal ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              quantity:
 *                                  type: number
 *                                  required: true
 *                          example:
 *                              quantity: 8
 *          responses:
 *              '200':
 *                description: >
 *                    Branch meal updated
 *              '404':
 *                description: >
 *                    Branch not found || Meal not found in branch
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.put("/edit/meals/quantity", isAuth, branchCtrl.modifyAvailableMealQuantity);

/**
 * @swagger
 *  /api/branches/edit/meals/statusAndPrice:
 *      put:
 *          summary: Modifies the price and status of an available meal
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: branchId
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Branch ID
 *              - in: query
 *                name: mealId
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Meal ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: boolean
 *                                  required: true
 *                              price:
 *                                  type: string
 *                                  required: true
 *                              endPromoDate:
 *                                  type: string
 *                                  required: true
 *                          example:
 *                              status: true
 *                              price: "1400"
 *                              endPromoDate: "2024/12/20"
 *          responses:
 *              '200':
 *                description: >
 *                    Branch meal updated
 *              '404':
 *                description: >
 *                    Branch not found || Meal not found in branch
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.put("/edit/meals/statusAndPrice", isAuth, branchCtrl.availableMealPromoPriceAndStatus);

/**
 * @swagger
 *  /api/branches/edit/deliverymode:
 *      put:
 *          summary: Modifies a branch delivery mode
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Branch ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              branch:
 *                                  type: boolean
 *                                  required: true
 *                              home:
 *                                  type: boolean
 *                                  required: true
 *                          example:
 *                              branch: true
 *                              home: false
 *          responses:
 *              '200':
 *                description: >
 *                    Branch delivery mode updated
 *              '404':
 *                description: >
 *                    Branch not found
 *              '500':
 *                  description: >
 *                    Server Error || Error updating branch delivery mode
 *
 */
router.put("/edit/deliverymode", isAuth, branchCtrl.updateDeliveryMode);

/**
 * @swagger
 *  /api/branches/edit/loyaltypoint:
 *      put:
 *          summary: Modifies a branch's localty point
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Branch ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              loyalties:
 *                                  type: number
 *                                  required: true
 *                          example:
 *                              loyalties: 1
 *          responses:
 *              '200':
 *                description: >
 *                    Branch localty point updated
 *              '404':
 *                description: >
 *                    Branch not found
 *              '500':
 *                  description: >
 *                    Server Error || Error updating branch localty point
 *
 */
router.put("/edit/loyaltypoint", isAuth, branchCtrl.updateLoyaltyPoints);

// -----------  DELETE ROUTES  -------------

/**
 * @swagger
 *  /api/branches/delete:
 *      delete:
 *          summary: Deletes a branch
 *          tags:
 *              - Branches
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Branch ID
 *          responses:
 *              '200':
 *                description: >
 *                    Branch successfully deleted
 *              '404':
 *                description: >
 *                    Branch not found
 *              '500':
 *                  description: >
 *                    Server Error || Branch could not be deleted due to an issue
 *
 */
router.delete("/delete", isAuth, branchCtrl.delete);


module.exports = router;