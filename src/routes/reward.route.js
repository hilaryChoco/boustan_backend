const express = require('express');
const router = express.Router();
const { rewardCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');


// -----------  GET ROUTES  -------------

/**
 * @swagger
 *  /api/rewards:
 *      get:
 *          summary: Displays a list of rewards
 *          tags:
 *              - Rewards
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
 *                    Returns a list of rewards
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.get("/", isAuth, rewardCtrl.getAll);

// -----------  POST ROUTES  -------------

/**
 * @swagger
 *  /api/rewards/create:
 *      post:
 *          summary: Creates a reward
 *          tags:
 *              - Rewards
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              nbLoyalties:
 *                                  type: number
 *                                  required: true
 *                              meals:
 *                                  type: array
 *                                  items:
 *                                      type: string
 *                                      required: true
 *                          example:
 *                              nbLoyalties: 500
 *                              meals: ["123", "456"]
 *          responses:
 *              '201':
 *                description: >
 *                    Reward successfully created
 *              '404':
 *                description: >
 *                    Some meals are not recognized
 *              '500':
 *                  description: >
 *                    Server Error || Reward creation failure
 *
 */
router.post("/create", isAuth, rewardCtrl.create);

/**
 * @swagger
 *  /api/rewards/exchange:
 *      post:
 *          summary: Exchange a reward
 *          tags:
 *              - Rewards
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              userId:
 *                                  type: string
 *                                  required: true
 *                              branchId:
 *                                  type: string
 *                                  required: true
 *                              mealId:
 *                                  type: string
 *                                  required: true
 *                              rewardId:
 *                                  type: string
 *                                  required: true
 *                              deliveryType:
 *                                  type: string
 *                                  required: true
 *                              deliveryPrice:
 *                                  type: number
 *                                  required: true
 *                          example:
 *                              userId: "753"
 *                              branchId: "8521"
 *                              mealId: "8521"
 *                              rewardId: "8521"
 *                              deliveryType: "branch"
 *                              deliveryPrice: 0
 *          responses:
 *              '201':
 *                description: >
 *                    Reward successfully created
 *              '404':
 *                description: >
 *                    Some meals are not recognized
 *              '500':
 *                  description: >
 *                    Server Error || Reward creation failure
 *
 */
router.post("/exchange", isAuth, rewardCtrl.exchangeReward);

// -----------  PUT ROUTES  -------------


// -----------  DELETE ROUTES  -------------

/**
 * @swagger
 *  /api/rewards/delete:
 *      delete:
 *          summary: Deletes a reward
 *          tags:
 *              - Rewards
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: query
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                description: Reward ID
 *          responses:
 *              '200':
 *                description: >
 *                    Reward successfully deleted
 *              '404':
 *                description: >
 *                    Reward not found
 *              '500':
 *                  description: >
 *                    Server Error || Reward could not be deleted due to an issue
 *
 */
router.delete("/delete", isAuth, rewardCtrl.delete);


module.exports = router;