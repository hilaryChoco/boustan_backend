const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, './keys.json')

const { Storage } = Cloud
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'hpay-reward',
})

// Function to refresh the authentication token
async function refreshAuthToken() {
  const client = storage.authClient;
  const tokens = await client.getAccessToken();
  storage.authClient.credentials = {
    client_email: 'service-storage@hpay-reward.iam.gserviceaccount.com',
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCuKJ+3K1iDIPEM\n4+kVxqCqftXK2I1+1ToLQLhtUBJ4Dnlkkz+/uck1Jw5EJsnN6GE/OEu0HD6D74Gq\njzNPH9GVKvkWJFXV5d7AQ6LseDrxwij77cEc2zPL/SnqmRILOSpSTpF4wklv02Qn\nOtUikrDQ0tsSaL8IxwzxHdROhTYQDeETAOP8JyHeeu/p9z1TM/7579FJOm3UQ5Ix\nLAhRCANRzmMDBdjjUHMtRv8Vi9YOFih9O3UukbmQssT29xNdsF0s14fVtZ/V39Ub\n6Bc/LdqbgedONbpVEZBiFn0+31A62CHhGRoLeplk/AZ7qG9NVImI7rT3zqeXvXsg\nRtKONPXVAgMBAAECggEABc1tsNUdYFUPIu5O/D4/aR7LsbPwVur0wZ445s91phFZ\nYwvy4kjm1sID3Cpsq9MTtl8CSrBsNsoaiFu4CmlVesJRRTcVswgzGTXHrlg9IoPl\nCKu9tN/qxF+db2cFLmGLsu1SNHNIrhSdcB8qLbo0cOititn5j2nOWRQ02B7hE7zM\nibUbdy665t5toNWjm+gM/E5RuPDSwwGaAntD5Xd6asftZa7g9ShmaecQSp0r/zt0\nNAJr20DEU4f1zYOagjzbGuA42DN543vclYP6DWazGZ4iyQK1u3JvpyMUI9PU7CS8\nB+t8oO1pOWoVztRgi2vKIhyMWP+vki5PF42xMEh3cQKBgQDia9iY2ofInRMRi2si\nJfau8fQ0RGn6ijLHkqQ8q1/9BdeueShjRdCsWSOP7t3t+thsBZ3nfFrAy5wjMAbW\nmUz9XkpFWTwcwNUy15jeX/8mWnMbcJe8nGekjVBALbpgaI3mu79R4gYmZU+f6yek\nChlnobzkQPIPqOfjNrWkR9S2OQKBgQDE6PjoM/Ky0UhjpM2XzPbcvVJtrkiZw9aj\nGUBoqrZmhddhZnvlk/Xj/JcDU0to0bVF4VqfnSe4i18Mh6NhxqG1Euy6b05MKJd+\nSaMK/Emre3nKvBYT+qbcdrfnBYphm8/tGkToLefMar0U6iwZx8sotvyIfLSL/WL0\n1/KFzLfcfQKBgDsOsjI8Xcpf3gdnfAwuJse+6FlxtsrYnSIdB6WjdagDjBxAEd7C\n6QjrPzFdtplKIoUaefNVJj6/XPx4nHABEGnN3EV2Xw2I5pMaVQ87rsuMMBXqKknR\n6d6r1VDIHKLk4o5aTi7Ha588MaaeqXpKABJdx20p23lmLwW+0WYGLl9RAoGADgBS\n0o//Dd/7uboaNFUKqJ99oPbniqd2N5qwDcE1vwx9SBu1a5mdvlxTkJT3o7hln1Zq\nzzapgGHInGd4opcxIGL8GjWX56prOzuZMErIIj1hZ50AJOOJwdtfMDogoNgnbMCV\nbbz14n8kerw77olaVMbOJhZX8CxQQQCp6gGogTECgYAVjKufzbNZsIucEMxOLWBU\ngNuuSx2CvQS6HVGulVjjurKKfmG8aqIAfYFzq5MVQjo+U0YjplJh7hHKiwybeRzc\n1KdisEwkJeXsbPgHlvvxcPKcYN/YSrzcle8T2ReImKFmrAHgodeLkNOEYqb3LoZw\nyc1sb9K7gFPBorsOU9ifaA==\n-----END PRIVATE KEY-----\n",
    access_token: tokens.token,
  };
}

module.exports = { storage, refreshAuthToken }