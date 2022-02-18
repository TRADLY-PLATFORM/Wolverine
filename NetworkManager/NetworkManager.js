const APPURL = require('../Constants/URLConstants');
import errorHandler from './ErrorHandle'
const to = require('await-to-js').default
import appConstant from '../Constants/AppConstants';
import DefaultPreference from 'react-native-default-preference';
import RNFetchBlob from 'rn-fetch-blob'
import AppKeys from '../AppKeys';


class NetworkManager {
  networkCall = async (path, method, param, token, auth, currency) => {
    let url = APPURL.URLPaths.BaseURL + path;
    console.log('url == ', url)
    console.log('param == ', param)
    console.log('token == ',AppKeys.bearer)
    console.log('auth == ', auth)
    let err, response
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-agent': 1,
    }
    if (appConstant.appLanguage.length != 0) {
      headers['x-language'] = appConstant.appLanguage
    }
    console.log(headers);
    headers['Authorization'] = "Bearer " + AppKeys.bearer;
    if (auth != undefined){
      headers['x-auth-key'] = auth
    }
    if (currency != undefined) {
      headers['X-Currency'] = currency;
    }
    [err, response] = await to(fetch(url, {
      method: method,
      dataType: 'json',
      headers: headers,
      body: param,
    }))
    if (err) {
      console.log('response error', err)
      let error = errorHandler.errorHandle(response['error']['code'],'server error')
      return error
    } else {
      const json = await response.json();
      if(json["error"])
      {
        if(json["error"]['code'] == 401){
          console.log('response error', json["error"])
          if (appConstant.authKey != undefined){
            if (appConstant.authKey.length != 0){
              return this.refreshKeyCall(path,method,param,token,auth,currency)
            } else {
              let error = errorHandler.errorHandle(json['error']['code'],json['error']['message']);
              return error
            }
          } else {
            let error = errorHandler.errorHandle(json['error']['code'],json['error']['message']);
            return error
          }
        } else {
          console.log('error => errror json ', json)
          console.log('error => errror json ', json['error']['errors'])
          let error = errorHandler.errorHandle(json['error']['code'],json['error']['message']);
          return error
        }
      }else {
        // console.log('response actual', json);
        // console.log('response actual', JSON.stringify(json));
        return json
      }
    }
  }
  async refreshKeyCall(path, method, param,token,auth,currency) {
    let url = APPURL.URLPaths.BaseURL + APPURL.URLPaths.token;
    console.log(' refreshKey url == ', url)
    console.log(' refreshKeyauth == ', auth)
    console.log(' refresh Key == ', appConstant.refreshKey)
    let err, response
    [err, response] = await to(fetch(url, {
      method: 'get',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Refresh-Key': appConstant.refreshKey,
        'x-agent': 1,
        'Authorization': "Bearer " + token,
      },
      body: '',
    }))
    if (err) {
      console.log('response error', err)
      let error = errorHandler.errorHandle(response['error']['code'],'Server error')
      return error
    } else {
      const json = await response.json();
      console.log('response actual', json)
      if(json["error"])
      {        
        if(json["error"]['code'] == 401){
          appConstant.loggedIn = false
          DefaultPreference.set('loggedIn', 'false').then(function () { console.log('done loggedIn') });
        }
        return json
      }else {
        const auth_key = json['data']['user']['key']['auth_key'];
        const refresh_key = json['data']['user']['key']['refresh_key'];
        appConstant.authKey = auth_key;
        appConstant.refreshKey = refresh_key;
        DefaultPreference.set('refreshKey', refresh_key).then();
        DefaultPreference.set('authKey', auth_key).then();
        return this.networkCall(path, method, param,token ,auth_key,currency)
      }
    }
  }
  async signedURLUpload(signedURL,mimeType,imagePath) {
    console.log('imagePath', imagePath)
    const pathToImage = imagePath.replace("file://", "");
    const headers = {
      'Content-Type':mimeType,
    }
    RNFetchBlob.fetch('PUT', signedURL, headers, RNFetchBlob.wrap(pathToImage)).then((res) => {
      // console.log('RNFetchBlob res', res)
      return true
    }).catch((error) => {
      console.log('error', error);
      return false
    })
  }
 async uploadFileWithSignedURL(signed_url, mime, blob_body) {
    let err, response;
    [err, response] = await to(
      fetch(signed_url, {
        method: 'put',
        headers: {'Content-Type': mime},
        body: blob_body,
      }),
    );
    if (err) {
      return false;
    } else {
      return true;
    }
  }
}
const network = new NetworkManager();
export default network;
