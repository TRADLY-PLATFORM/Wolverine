const APPURL = require('../Constants/URLConstants');
import errorHandler from './ErrorHandle'
const to = require('await-to-js').default

class NetworkManager {
  networkCall = async (path, method, param, token, auth) => {
    let url = APPURL.URLPaths.BaseURL + path;
    console.log('url == ', url)
    console.log('param == ', param)
    console.log('token == ', token)
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
      console.log('response actual', json)
      return json
    }
  }

  networkServicesWithoutToken = async (path, method, param) => {
    DefaultPreference.get('token').then(function (token) {
      console.log('bToken = =', token)
      DefaultPreference.get('authKey').then(function (auth) {
        console.log('auth = =', auth)
        const responseJson = this.networkCall(path, method, param, token, auth)
        return responseJson
      }.bind(this))
    }.bind(this))
  }
  async refreshKeyCall(path, method, param, auth) {
    let url = APPURL.URLPaths.BaseURL + path;
    console.log(' refreshKey url == ', url)
    console.log(' refreshKey param == ', param)
    console.log(' refreshKeyauth == ', auth)

    let err, response
    [err, response] = await to(fetch(url, {
      method: method,
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'auth_key': auth,
        'x-agent': 1,
      },
      body: param,
    }))
    if (err) {
      console.log('response error', err)
      let error = errorHandler.errorHandle(response['error']['code'])
      return error
    } else {
      const json = await response.json();
      console.log('response actual', json)

      this.networkCall(path, method, param, auth)
      return json
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


}
const network = new NetworkManager();
export default network;
