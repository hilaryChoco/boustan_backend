const express = require('express');
const router = express.Router();
const { userCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');


// -----------  GET ROUTES  -------------

/**
 * @swagger
 *  /api/users:
 *      get:
 *          summary: Displays a list of users
 *          tags:
 *              - Users
 *          security:
 *              - bearerAuth: []
 *          parameters:
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
 *                    Returns a list of users
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/", isAuth, userCtrl.paginateAccountsList);

/**
 * @swagger
 *  /api/users/loyaltypoint:
 *      get:
 *          summary: Displays a user's loyalty point
 *          tags:
 *              - Users
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: User ID
 *          responses:
 *              '200':
 *                description: >
 *                    Returns a user's loyalty point
 *              '404':
 *                description: >
 *                    User not found
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/loyaltypoint", isAuth, userCtrl.getLoyaltyPoint);

// -----------  POST ROUTES  -------------

/**
 * @swagger
 *  /api/users/auth/login:
 *      post:
 *          summary: User logs into the platform
 *          tags:
 *              - Auth
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  required: true
 *                          example:
 *                              email: "john@email.com"
 *          responses:
 *              '200':
 *                description: >
 *                    Please check your mails to get your authentication code
 *              '400':
 *                description: >
 *                    Invalid email
 *              '404':
 *                description: >
 *                    User not found
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.post("/auth/login", userCtrl.login);

/**
 * @swagger
 *  /api/users/auth/logout:
 *      post:
 *          summary: User logs out of the platform
 *          tags:
 *              - Auth
 *          responses:
 *              '200':
 *                description: >
 *                    Logout successfull
 *
 */
router.post("/auth/logout", userCtrl.logout);

/**
 * @swagger
 *  /api/users/create:
 *      post:
 *          summary: Creation of a user account
 *          tags:
 *              - Users
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  required: true
 *                              firstName:
 *                                  type: string
 *                                  required: true
 *                              name:
 *                                  type: string
 *                                  required: true
 *                              phone:
 *                                  type: string
 *                                  required: false
 *                              dateOfBirth:
 *                                  type: string
 *                                  required: false
 *                              zipCode:
 *                                  type: string
 *                                  required: true
 *                              loyalties:
 *                                  type: number
 *                                  required: false
 *                          example:
 *                              email: "john@email.com"
 *                              firstName: "John"
 *                              name: "Boust"
 *                              phone: "8521056"
 *                              dateOfBirth: "2001/05/17"
 *                              zipCode: "00000"
 *                              loyalties: 1
 *          responses:
 *              '201':
 *                description: >
 *                    Account successfully created
 *              '400':
 *                description: >
 *                    Invalid email ||
 *                    The email you entered is already taken
 *              '500':
 *                  description: >
 *                    Server Error || Account creation failure
 *
 */
router.post("/create", userCtrl.createAccount);

/**
 * @swagger
 *  /api/users/auth/resend-otp:
 *      post:
 *          summary: Resends OTP to user
 *          tags:
 *              - Auth
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  required: true
 *                          example:
 *                              email: "john@email.com"
 *          responses:
 *              '200':
 *                description: >
 *                    Please check your mails to get your authentication code
 *              '400':
 *                description: >
 *                    Invalid email
 *              '404':
 *                description: >
 *                    User not found
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.post("/auth/resend-otp", userCtrl.login);

/**
 * @swagger
 *  /api/users/auth/otp-validation:
 *      post:
 *          summary: Validates user's OTP
 *          tags:
 *              - Auth
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  required: true
 *                              otp:
 *                                  type: string
 *                                  required: true
 *                          example:
 *                              email: "john@email.com"
 *                              otp: "0000"
 *          responses:
 *              '200':
 *                description: >
 *                    Valid code
 *              '400':
 *                description: >
 *                    Invalid email || Invalid code
 *              '404':
 *                description: >
 *                    User not found
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.post("/auth/otp-validation", userCtrl.validateOTP);

// -----------  PUT ROUTES  -------------

/**
 * @swagger
 *  /api/users/edit:
 *      put:
 *          summary: Modification of user account information
 *          tags:
 *              - Users
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  required: true
 *                              firstName:
 *                                  type: string
 *                                  required: true
 *                              name:
 *                                  type: string
 *                                  required: true
 *                              phone:
 *                                  type: string
 *                                  required: false
 *                              dateOfBirth:
 *                                  type: string
 *                                  required: false
 *                              zipCode:
 *                                  type: string
 *                                  required: true
 *                              loyalties:
 *                                  type: number
 *                                  required: false
 *                          example:
 *                              email: "john@email.com"
 *                              firstName: "John"
 *                              name: "Boust"
 *                              phone: "8521056"
 *                              dateOfBirth: "2001/05/17"
 *                              zipCode: "00000"
 *                              loyalties: 1
 *          responses:
 *              '200':
 *                description: >
 *                    Account modification successfull
 *              '400':
 *                description: >
 *                    Invalid email
 *              '404':
 *                description: >
 *                    User not found
 *              '500':
 *                  description: >
 *                    Server Error || Account modification failure
 *
 */
router.put("/edit", isAuth, userCtrl.editAccount);

// -----------  DELETE ROUTES  -------------

/**
 * @swagger
 *  /api/users/delete:
 *      delete:
 *          summary: Deletes a user's account
 *          tags:
 *              - Users
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: email
 *                schema:
 *                  type: string
 *                  required: true
 *                description: User email
 *          responses:
 *              '200':
 *                description: >
 *                    Account deleted successfully
 *              '400':
 *                description: >
 *                    Invalid email || You are not allowed to delete this account
 *              '404':
 *                description: >
 *                    User not found
 *              '500':
 *                  description: >
 *                    Server Error || An error has occured, please try again later
 *
 */
router.delete("/delete", isAuth, userCtrl.deleteAccount);


module.exports = router;