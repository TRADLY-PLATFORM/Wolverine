const APPURL = require('../Constants/URLConstants');
import errorHandler from './ErrorHandle'
const to = require('await-to-js').default
import appConstant from '../Constants/AppConstants';
import DefaultPreference from 'react-native-default-preference';


class NetworkManager {
  networkCall = async (path, method, param, token, auth) => {
    let url = APPURL.URLPaths.BaseURL + path;
    console.log('url == ', url)
    console.log('param == ', param)
    console.log('token == ', token)
    console.log('auth == ', auth)
    let err, response
    [err, response] = await to(fetch(url, {
      method: method,
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'x-agent': 1,
        'x-auth-key': auth
      },
      body: param,
    }))
    if (err) {
      console.log('response error', err)
      let error = errorHandler.errorHandle(response['error']['code'])
      return error
    } else {
      const json = await response.json();
      if(json["error"])
      {
        if(json["error"]['code'] == 401){
          return  this.refreshKeyCall(path,method,param,token,auth)
        } else {
          console.log('error => errror json ', json)
          let error = errorHandler.errorHandle(json['error']['code']);
          return error
        }
      }else {
        console.log('response actual', json)
        return json
      }
    }
  }
  async refreshKeyCall(path, method, param,token,auth) {
    let url = APPURL.URLPaths.BaseURL + APPURL.URLPaths.token;
    console.log(' refreshKey url == ', url)
    console.log(' refreshKeyauth == ', auth)
    console.log(' refresh Key == ', appConstant.refreshKey)

    let err, response
    [err, response] = await to(fetch(url, {
      method: method,
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
      let error = errorHandler.errorHandle(response['error']['code'])
      return error
    } else {
      const json = await response.json();
      console.log('response actual', json)
      if(json["error"])
      {        
        let error = errorHandler.errorHandle(json['error']['code']);
        return json
      }else {
        const auth_key = json['data']['user']['key']['auth_key'];
        const refresh_key = json['data']['user']['key']['refresh_key'];
        appConstant.authKey = auth_key;
        appConstant.refreshKey = refresh_key;
        DefaultPreference.set('refreshKey', refresh_key).then();
        DefaultPreference.set('authKey', auth_key).then();
        return this.networkCall(path, method, param,token ,auth_key)
      }
    }
  }
  async uploadImage(path, method, param, mimeType) {
    let url = path;
    console.log(' uploadImage url == ', url, 'mimeType', mimeType)
    let err, response
    await fetch(url, {
      method,
      body: param,
      headers: {
        'Content-Type': mimeType,
      }
    }).then(res => res.text()) // or res.json()
      .then(res => console.log("dsdsd ", res))
  }
  async uploadImageWithSignedURL(path, mime, param) {
    let url = path;
    console.log('url == ', url)
    let err, response
    [err, response] = await to(fetch(path, {
      method: 'PUT',
      headers: {
        'Content-Type': mime,
      },
      body: param,
    }))
    if (err) {
      console.log('response error', err)
      let error = errorHandler.errorHandle(response['error']['code'])
      return error
    } else {
      console.log('response backend', response)

      const json = await response.json();
      console.log('response actual', json)
      return json
    }
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
      console.log('response error', err);
      return false;
    } else {
      console.log('response uploadFileWithSignedURL', response);
      return true;
    }
  }

}
const network = new NetworkManager();
export default network;
