
import React, {Component} from 'react';
import branch, { BranchEvent } from 'react-native-branch'

class BranchDeepLinking {
  initBranch = async (callback) => {
    // only canonicalIdentifier is required
    let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
      locallyIndex: true,
      title: 'ClassBubs',
      contentDescription: 'Check out this event on ClassBubs',
    })
    let linkProperties = {
      feature: 'share',
      channel: 'facebook',
      id:126,
    }
    // let controlParams = {
    //   'id': '126'
    // }
    // let { url } = await branchUniversalObject.generateShortUrl(controlParams)

    let {channel, completed, error} = await branchUniversalObject.showShareSheet()
    // return callback(url);
  }
  
  readDeepLinking = async () => {
     await branch.subscribe(({error, params, uri}) => {
      console.log('uri',uri)
      console.log('params',params)
      if (error) {
        console.error('Error from Branch: ' + error)
        return
      }
    
      // params will never be null if error is null
    
      if (params['+non_branch_link']) {
        const nonBranchUrl = params['+non_branch_link']
        // Route non-Branch URL if appropriate.
        return
      }
    
      if (!params['+clicked_branch_link']) {
        // Indicates initialization success and some other conditions.
        // No link was opened.
        return
      }
    
      // A Branch link was opened.
      // Route link based on data in params, e.g.
    
      // Get title and url for route
      // const title = params.$og_title
      // const url = params.$canonical_url
      // const image = params.$og_image_url
    
      // // Now push the view for this URL
      // this.navigator.push({ title: title, url: url, image: image })
    })
  }
}
const deep = new BranchDeepLinking();
export default deep;