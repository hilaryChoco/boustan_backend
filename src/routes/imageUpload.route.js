const express = require('express');
const router = express.Router();
const multer = require('multer');
const { imageUploadCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');


const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      // no larger than 5mb.
      fileSize: 5 * 1024 * 1024,
    },
  });


// app.use(multerMid.single('file'));

/**
 * @swagger
 *  /api/uploads/image:
 *      post:
 *          summary: Uploads an image to Google Cloud Storage
 *          tags:
 *              - Uploads
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              file:
 *                                  type: string
 *                                  format: binary
 *                                  required: true
 *                          example:
 *                              file: ""
 *          responses:
 *              '200':
 *                description: >
 *                    File sent successfully
 *              '500':
 *                  description: >
 *                    Server Error
 *
 */
router.post("/image", isAuth, multerMid.single('file'), imageUploadCtrl.uploadImage);


module.exports = router;