
import React, { Component } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

import branch from 'react-native-branch'

export const  showShareSheet = async (param) => {
  let branchUniversalObject = await branch.createBranchUniversalObject('meetneeds', { title: 'Meet Needs' })
  let linkProperties = { feature: 'share', channel: 'Meet Neeet' }
  let controlParams = { 'id': param }
  let { channel, completed, error } = await branchUniversalObject.showShareSheet(linkProperties, controlParams)
}

// Unsubscribe
