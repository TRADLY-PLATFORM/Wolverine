import appConstant from '../Constants/AppConstants';
import DefaultPreference from 'react-native-default-preference';

import {firebaseAuth} from '../Firebase/FirebaseAuth'

export default class UserModel {
  static userData(object) {
    console.log('key: ', object);
    const auth_key = object['data']['user']['key']['auth_key'];
    const refresh_key = object['data']['user']['key']['refresh_key'];
    const firebase_Token = object['data']['user']['key']['firebase_token'];
    const udata = object['data']['user'];
    appConstant.loggedIn = true;
    appConstant.refreshKey = refresh_key;
    appConstant.authKey = auth_key;
    appConstant.userId = udata['id'];
    appConstant.profilePic = udata['profile_pic'] ?? ''
    appConstant.firebaseToken = firebase_Token;
    appConstant.userName = `${udata['first_name']} ${udata['last_name']}`;
    firebaseAuth(firebase_Token);
    DefaultPreference.set('uName', appConstant.userName).then();
    DefaultPreference.set('refreshKey', refresh_key).then();
    DefaultPreference.set('authKey', auth_key).then();
    DefaultPreference.set('userId', udata['id']).then();
    DefaultPreference.set('profilePic', udata['profile_pic'] ?? '').then();
    DefaultPreference.set('firebaseToken', firebase_Token).then();
    DefaultPreference.set('loggedIn', 'true').then(function () { console.log('done loggedIn') });
  }
}