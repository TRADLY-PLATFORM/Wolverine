
import React, { Component } from 'react';
import { Platform, PermissionsAndroid,Share} from 'react-native';

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
  let {url} = await branchUniversalObject.generateShortUrl(linkProperties)
  // let { channel, completed, error } = await branchUniversalObject.showShareSheet(linkProperties)
  try {
    const result = await Share.share({
      message: url,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }

}
// Unsubscribe
