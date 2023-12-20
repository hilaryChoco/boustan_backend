const express = require('express');
const router = express.Router();
const { adminCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');


// -----------  GET ROUTES  -------------

/**
 * @swagger
 *  /api/admins:
 *      get:
 *          summary: Displays a list of admins
 *          tags:
 *              - Admins
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: limit
 *                schema:
 *                  type: string
 *                  required: false
 *                description: Number of items
 *              - in: query
 *                name: page
 *                schema:
 *                  type: string
 *                  required: false
 *                description: Page number
 *              - in: query
 *                name: order
 *                schema:
 *                  type: string
 *                  required: false
 *                description: Sorting order ["asc", "desc"]
 *          responses:
 *              '200':
 *                description: >
 *                    Returns a list of admins
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/", isAuth, adminCtrl.paginateAccountsList);

// -----------  POST ROUTES  -------------

/**
 * @swagger
 *  /api/admins/auth/login:
 *      post:
 *          summary: Admin connects to the platform
 *          tags:
 *              - Admins
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              userName:
 *                                  type: string
 *                                  required: true
 *                              password:
 *                                  type: string
 *                                  required: true
 *                          example:
 *                              userName: "johnADMIN"
 *                              password: "Test_1234"
 *          responses:
 *              '200':
 *                description: >
 *                    Login successfull
 *              '400':
 *                description: >
 *                    Wrong password
 *              '404':
 *                description: >
 *                    User not found
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.post("/auth/login", adminCtrl.login);

/**
 * @swagger
 *  /api/admins/auth/logout:
 *      post:
 *          summary: Admin logs out of the platform
 *          tags:
 *              - Admins
 *          responses:
 *              '200':
 *                description: >
 *                    Logout successfull
 *
 */
router.post("/auth/logout", adminCtrl.logout);

/**
 * @swagger
 *  /api/admins/create:
 *      post:
 *          summary: Creation of an admin account
 *          tags:
 *              - Admins
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              userName:
 *                                  type: string
 *                                  required: true
 *                              password:
 *                                  type: string
 *                                  required: true
 *                              type:
 *                                  type: string
 *                                  required: true
 *                                  description: enum ["branch", "main"]
 *                              branch:
 *                                  type: string
 *                                  required: false
 *                                  description: Branch id - Required if type is "branch"
 *                          example:
 *                              userName: "johnADMIN"
 *                              password: "Test_1234"
 *                              type: "branch"
 *                              branch: "81056"
 *          responses:
 *              '201':
 *                description: >
 *                    Account successfully created
 *              '400':
 *                description: >
 *                    Username required ||
 *                    The username you entered is already taken ||
 *                    Account type not recognized || 
 *                    Branch is required for a branch account
 *              '500':
 *                  description: >
 *                    Server Error || Account creation failure
 *
 */
router.post("/create", adminCtrl.createAccount);

// -----------  PUT ROUTES  -------------


// -----------  DELETE ROUTES  -------------

/**
 * @swagger
 *  /api/admins/delete:
 *      delete:
 *          summary: Deletes admin account
 *          tags:
 *              - Admins
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Admin email
 *          responses:
 *              '200':
 *                description: >
 *                    Account deleted successfully
 *              '400':
 *                description: >
 *                    You are not allowed to delete this account
 *              '404':
 *                description: >
 *                    Account not found
 *              '500':
 *                  description: >
 *                    Server Error || An error has occured, please try again later
 *
 */
router.delete("/delete", isAuth, adminCtrl.deleteAccount);


module.exports = router;