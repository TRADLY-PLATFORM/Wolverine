
import React, { Component } from 'react';
import {Share,Platform} from 'react-native';

import branch from 'react-native-branch'
import AppConstants from '../Constants/AppConstants';

export const showShareSheet = async (type, param) => {

  let key  = type == 'listing' ? 'listing_id' :'account_id'
  var branchUniversalObject = await branch.createBranchUniversalObject('classbubs', {
    title: AppConstants.appHomeTitle,
    contentDescription:AppConstants.branchDescription,
    contentMetadata: {
      customMetadata: {
        link_type: type,
        [key]: `${param}`,
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
      title:AppConstants.branchDescription,
      message: Platform.OS == 'android' ? url :  AppConstants.branchDescription,
      url:url,
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