const express = require('express');
const router = express.Router();
const { optionCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');


// -----------  GET ROUTES  -------------

/**
 * @swagger
 *  /api/options:
 *      get:
 *          summary: Displays a list of options
 *          tags:
 *              - Option
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              '200':
 *                description: >
 *                    Returns a list of options
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/", isAuth, optionCtrl.getAll);

// -----------  POST ROUTES  -------------

/**
 * @swagger
 *  /api/options/create:
 *      post:
 *          summary: Creates an option
 *          tags:
 *              - Option
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
 *                              max:
 *                                  type: number
 *                                  required: true
 *                              required:
 *                                  type: boolean
 *                                  required: true
 *                              elements:
 *                                  type: array
 *                                  items:
 *                                      type: "object"
 *                                      properties:
 *                                          name:
 *                                              type: string
 *                                              required: true
 *                                          price:
 *                                              type: string
 *                                              required: true
 *                          example:
 *                              name: "Option1"
 *                              max: 3
 *                              required: true
 *                              elements: [{
 *                                  name: "Element1",
 *                                  price: "1200"
 *                              }]
 *          responses:
 *              '201':
 *                description: >
 *                    Option successfully created
 *              '500':
 *                  description: >
 *                    Server Error || Option creation failure
 *
 */
router.post("/create", isAuth, optionCtrl.create);

// -----------  PUT ROUTES  -------------

/**
 * @swagger
 *  /api/options/edit:
 *      put:
 *          summary: Modifies an option
 *          tags:
 *              - Option
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Option ID
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
 *                              max:
 *                                  type: number
 *                                  required: true
 *                              required:
 *                                  type: boolean
 *                                  required: true
 *                              elements:
 *                                  type: array
 *                                  items:
 *                                      type: "object"
 *                                      properties:
 *                                          name:
 *                                              type: string
 *                                              required: true
 *                                          price:
 *                                              type: string
 *                                              required: true
 *                          example:
 *                              name: "Option1"
 *                              max: 5
 *                              required: false
 *                              elements: [{
 *                                  name: "Element1",
 *                                  price: "1200"
 *                              }]
 *          responses:
 *              '200':
 *                description: >
 *                    Option successfully modified
 *              '404':
 *                description: >
 *                    Option not found
 *              '500':
 *                  description: >
 *                    Server Error || An error occured during option modification
 *
 */
router.put("/edit", isAuth, optionCtrl.edit);

// -----------  DELETE ROUTES  -------------

/**
 * @swagger
 *  /api/options/delete:
 *      delete:
 *          summary: Deletes a option
 *          tags:
 *              - Option
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Option ID
 *          responses:
 *              '200':
 *                description: >
 *                    Option successfully deleted
 *              '400':
 *                description: >
 *                    Sorry, you cannot delete this option because it belongs to some meals.
 *              '404':
 *                description: >
 *                    Option not found
 *              '500':
 *                  description: >
 *                    Server Error || Option could not be deleted due to an issue
 *
 */
router.delete("/delete", isAuth, optionCtrl.delete);


module.exports = router;