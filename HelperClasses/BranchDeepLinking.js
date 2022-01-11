
import React, { Component } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

import branch from 'react-native-branch'
import AppConstants from '../Constants/AppConstants';

export const showShareSheet = async (type, param) => {
  var branchUniversalObject = await branch.createBranchUniversalObject('meetneeds', {
    title: AppConstants.appHomeTitle,
    contentDescription:AppConstants.branchDescription,
    contentMetadata: {
      ratingAverage: 4.2,
      customMetadata: {
        link_type: type,
        account_id: `${param}`
      }
    }
  })
  let linkProperties = {
    feature: 'app',
    channel: 'Product share'
  }
  let { channel, completed, error } = await branchUniversalObject.showShareSheet(linkProperties)
}
// Unsubscribe
