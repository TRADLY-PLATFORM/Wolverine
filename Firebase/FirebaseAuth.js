import React, { Component } from 'react';
import { Linking, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';

export function firebaseAuth(token) {
  // console.log('waiting',Platform.OS,  token);
  if (token != undefined) {
    auth()
      .signInWithCustomToken(token)
      .then(() => {
        console.log('User signed in anonymously');
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }
        console.error('auth error==> ', error);
      });
  }
}
