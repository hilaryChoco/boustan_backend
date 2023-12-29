const express = require('express');
const router = express.Router();
const { mealCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');


// -----------  GET ROUTES  -------------

/**
 * @swagger
 *  /api/meals:
 *      get:
 *          summary: Displays a list of meals
 *          tags:
 *              - Meals
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              '200':
 *                description: >
 *                    Returns a list of meals
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/", isAuth, mealCtrl.getAll);

/**
 * @swagger
 *  /api/meals/by-category:
 *      get:
 *          summary: Displays a list of meals by category
 *          tags:
 *              - Meals
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: categoryId
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Category ID
 *              - in: query
 *                name: limit
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Number of items
 *              - in: query
 *                name: page
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Page number
 *              - in: query
 *                name: order
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Sorting order ["asc", "desc"]
 *          responses:
 *              '200':
 *                description: >
 *                    Returns a list of meals
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/by-category", isAuth, mealCtrl.getAllByCategoryId);

// -----------  POST ROUTES  -------------

/**
 * @swagger
 *  /api/meals/create:
 *      post:
 *          summary: Creates a meal
 *          tags:
 *              - Meals
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
 *                              uri:
 *                                  type: string
 *                                  required: true
 *                              price:
 *                                  type: string
 *                                  required: true
 *                              categoryId:
 *                                  type: string
 *                                  required: true
 *                              optionIds:
 *                                  type: array
 *                                  items:
 *                                      type: string
 *                                      required: true
 *                          example:
 *                              name: "Meal1"
 *                              uri: "image-path"
 *                              price: "2000"
 *                              categoryId: "1205"
 *                              optionIds: ["123", "456"]
 *          responses:
 *              '201':
 *                description: >
 *                    Meal successfully created
 *              '404':
 *                description: >
 *                    Meal not found || Category not recognized || Some options are not recognized
 *              '500':
 *                  description: >
 *                    Server Error || Meal creation failure
 *
 */
router.post("/create", isAuth, mealCtrl.create);

// -----------  PUT ROUTES  -------------

/**
 * @swagger
 *  /api/meals/edit:
 *      put:
 *          summary: Modifies a meal
 *          tags:
 *              - Meals
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
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
 *                              name:
 *                                  type: string
 *                                  required: true
 *                              uri:
 *                                  type: string
 *                                  required: true
 *                              price:
 *                                  type: string
 *                                  required: true
 *                              categoryId:
 *                                  type: string
 *                                  required: true
 *                              optionIds:
 *                                  type: array
 *                                  items:
 *                                      type: string
 *                                      required: true
 *                          example:
 *                              name: "Meal2"
 *                              uri: "image-url"
 *                              price: "2500"
 *                              categoryId: "1215"
 *                              optionIds: ["103", "406"]
 *          responses:
 *              '200':
 *                description: >
 *                    Meal successfully modified
 *              '404':
 *                description: >
 *                    Meal not found || Category not recognized || Some options are not recognized
 *              '500':
 *                  description: >
 *                    Server Error || An error occured during meal modification
 *
 */
router.put("/edit", isAuth, mealCtrl.edit);

// -----------  DELETE ROUTES  -------------

/**
 * @swagger
 *  /api/meals/delete:
 *      delete:
 *          summary: Deletes a meal
 *          tags:
 *              - Meals
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Meal ID
 *          responses:
 *              '200':
 *                description: >
 *                    Meal successfully deleted
 *              '404':
 *                description: >
 *                    Meal not found
 *              '500':
 *                  description: >
 *                    Server Error || Meal could not be deleted due to an issue
 *
 */
router.delete("/delete", isAuth, mealCtrl.delete);


module.exports = router;