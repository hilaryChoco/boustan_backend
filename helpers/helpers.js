const util = require('util');
const { storage, refreshAuthToken } = require('../config');
const bucket = storage.bucket('hpay-reward-bucket') // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

exports.uploadImage = (file) => new Promise(async (resolve, reject) => {
  const { originalname, buffer } = file

  await refreshAuthToken();
  const blob = bucket.file(originalname.replace(/ /g, "_"))
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', (err) => {
    console.error('Error uploading image:', err);
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})