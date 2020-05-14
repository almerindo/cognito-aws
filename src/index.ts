import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

import AWS from 'aws-sdk';

import 'isomorphic-fetch';

import config from './cognito.config';

// ##############################################
const authenticationData = {
  Username: 'diogo@codengage.com',
  Password: '123123',
};
const authenticationDetails = new AuthenticationDetails(authenticationData);
const poolData = {
  UserPoolId: config.aws_user_pools_id, // Your user pool id here
  ClientId: config.aws_user_pools_web_client_id, // Your client id here
};
const userPool = new CognitoUserPool(poolData);
const userData = {
  Username: 'diogo@codengage.com', // username
  Pool: userPool,
};

const cognitoUser = new CognitoUser(userData);

cognitoUser.authenticateUser(authenticationDetails, {
  onSuccess(result) {
    console.log(`access token + ${result.getAccessToken().getJwtToken()}`);

    // POTENTIAL: Region needs to be set if not already set previously elsewhere.
    AWS.config.region = '<region>';

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: '...', // your identity pool id here
      Logins: {
        // Change the key below according to the specific region your user pool is in.
        'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': result
          .getIdToken()
          .getJwtToken(),
      },
    });

    // Instantiate aws sdk service objects now that the credentials have been updated.
    // example: var s3 = new AWS.S3();
  },

  onFailure(err) {
    console.error(err);
  },
});
