const express = require('express');
const router = express.Router();
const { elementCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');


// -----------  GET ROUTES  -------------

/**
 * @swagger
 *  /api/elements:
 *      get:
 *          summary: Displays a list of elements
 *          tags:
 *              - Option Elements
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              '200':
 *                description: >
 *                    Returns a list of elements
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/", isAuth, elementCtrl.getAll);

// -----------  POST ROUTES  -------------

/**
 * @swagger
 *  /api/elements/create:
 *      post:
 *          summary: Creates an element
 *          tags:
 *              - Option Elements
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
 *                              price:
 *                                  type: string
 *                                  required: true
 *                          example:
 *                              name: "Element1"
 *                              price: "5000"
 *          responses:
 *              '201':
 *                description: >
 *                    Element successfully created
 *              '500':
 *                  description: >
 *                    Server Error || Element creation failure
 *
 */
router.post("/create", isAuth, elementCtrl.create);

// -----------  PUT ROUTES  -------------

/**
 * @swagger
 *  /api/elements/edit:
 *      put:
 *          summary: Modifies an element
 *          tags:
 *              - Option Elements
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Element ID
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
 *                              price:
 *                                  type: string
 *                                  required: true
 *                          example:
 *                              name: "Element2"
 *                              price: "8000"
 *          responses:
 *              '200':
 *                description: >
 *                    Element successfully modified
 *              '404':
 *                description: >
 *                    Element not found
 *              '500':
 *                  description: >
 *                    Server Error || An error occured during element modification
 *
 */
router.put("/edit", isAuth, elementCtrl.edit);

// -----------  DELETE ROUTES  -------------

/**
 * @swagger
 *  /api/elements/delete:
 *      delete:
 *          summary: Deletes a element
 *          tags:
 *              - Option Elements
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Element ID
 *          responses:
 *              '200':
 *                description: >
 *                    Element successfully deleted
 *              '400':
 *                description: >
 *                    Sorry, you cannot delete this element because it belongs to some options.
 *              '404':
 *                description: >
 *                    Element not found
 *              '500':
 *                  description: >
 *                    Server Error || Element could not be deleted due to an issue
 *
 */
router.delete("/delete", isAuth, elementCtrl.delete);


module.exports = router;