const express = require('express');
const router = express.Router();
const { categoryCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');


// -----------  GET ROUTES  -------------

/**
 * @swagger
 *  /api/categories:
 *      get:
 *          summary: Displays a list of categories
 *          tags:
 *              - Categories
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              '200':
 *                description: >
 *                    Returns a list of categories
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/", isAuth, categoryCtrl.getAll);

// -----------  POST ROUTES  -------------

/**
 * @swagger
 *  /api/categories/create:
 *      post:
 *          summary: Creation of a category
 *          tags:
 *              - Categories
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
 *                          example:
 *                              name: "Category1"
 *                              uri: "/image-uri"
 *          responses:
 *              '201':
 *                description: >
 *                    Category successfully created
 *              '500':
 *                  description: >
 *                    Server Error || Category creation failure
 *
 */
router.post("/create", isAuth, categoryCtrl.create);

// -----------  PUT ROUTES  -------------

/**
 * @swagger
 *  /api/categories/edit:
 *      put:
 *          summary: Modifies a category
 *          tags:
 *              - Categories
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Category ID
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
 *                          example:
 *                              name: "Category2"
 *                              uri: "/image-path"
 *          responses:
 *              '200':
 *                description: >
 *                    Category successfully modified
 *              '404':
 *                description: >
 *                    Category not found
 *              '500':
 *                  description: >
 *                    Server Error || An error occured during category modification
 *
 */
router.put("/edit", isAuth, categoryCtrl.edit);

// -----------  DELETE ROUTES  -------------

/**
 * @swagger
 *  /api/categories/delete:
 *      delete:
 *          summary: Deletes a category
 *          tags:
 *              - Categories
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Category ID
 *          responses:
 *              '200':
 *                description: >
 *                    Category successfully deleted
 *              '400':
 *                description: >
 *                    Sorry, you cannot delete this category because it contains some meals.
 *              '404':
 *                description: >
 *                    Category not found
 *              '500':
 *                  description: >
 *                    Server Error || Category could not be deleted due to an issue
 *
 */
router.delete("/delete", isAuth, categoryCtrl.delete);


module.exports = router;