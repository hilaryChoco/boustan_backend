const express = require('express');
const router = express.Router();
const { orderCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');


// -----------  GET ROUTES  -------------

/**
 * @swagger
 *  /api/orders/user:
 *      get:
 *          summary: Displays a user's list of orders
 *          tags:
 *              - Orders
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: userId
 *                schema:
 *                  type: string
 *                description: User ID
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
 *                    Returns a list of orders
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/user", isAuth, orderCtrl.getUserOrders);

// -----------  POST ROUTES  -------------

/**
 * @swagger
 *  /api/orders/create:
 *      post:
 *          summary: Creation of an order
 *          tags:
 *              - Orders
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              branch:
 *                                  type: string
 *                                  required: true
 *                                  description: Branch ID
 *                              email:
 *                                  type: string
 *                                  required: true
 *                                  description: User email
 *                              partialPrice:
 *                                  type: number
 *                                  required: true
 *                              deliveryType:
 *                                  type: string
 *                                  required: true
 *                              deliveryPrice:
 *                                  type: number
 *                                  required: true
 *                              totalPrice:
 *                                  type: number
 *                                  required: true
 *                              orderMeals:
 *                                  type: array
 *                                  items:
 *                                      type: "object"
 *                                      properties:
 *                                          idOrderMeal:
 *                                              type: string
 *                                              required: true
 *                                          nameOrderMeal:
 *                                              type: string
 *                                              required: true
 *                                          quantity:
 *                                              type: number
 *                                              required: true
 *                                          orderMealOptionList:
 *                                              type: array
 *                                              items:
 *                                                  type: "object"
 *                                                  properties:
 *                                                      idOption:
 *                                                          type: string
 *                                                          required: true
 *                                                      nameOption:
 *                                                          type: string
 *                                                          required: true
 *                                                      items:
 *                                                          type: array
 *                                                          items:
 *                                                              type: "object"
 *                                                              properties:
 *                                                                  name:
 *                                                                      type: string
 *                                                                      required: true
 *                                                                  price:
 *                                                                      type: number
 *                                                                      required: true
 *                          example:
 *                              branch: "458652"
 *                              email: "john@email.com"
 *                              partialPrice: 1500
 *                              deliveryType: "home"
 *                              deliveryPrice: 1000
 *                              totalPrice: 2500
 *                              orderMeals: [
 *                                  {
 *                                      idOrderMeal: "8520",
 *                                      nameOrderMeal: "Meal22",
 *                                      quantity: 2,
 *                                      orderMealOptionList: [
 *                                          {
 *                                              idOption: "7410",
 *                                              nameOption: "Option85",
 *                                              items: [
 *                                                  {
 *                                                      name: "Element1",
 *                                                      price: 5000
 *                                                  }
 *                                              ]
 *                                          }
 *                                      ]
 *                                  }
 *                              ]
 *          responses:
 *              '201':
 *                description: >
 *                    Order saved
 *              '404':
 *                description: >
 *                    Client data not found || Branch not found
 *              '500':
 *                  description: >
 *                    Server Error || Order not saved
 *
 */
router.post("/create", isAuth, orderCtrl.create);

// -----------  PUT ROUTES  -------------



// -----------  DELETE ROUTES  -------------




module.exports = router;