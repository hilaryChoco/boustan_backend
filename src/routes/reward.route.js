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