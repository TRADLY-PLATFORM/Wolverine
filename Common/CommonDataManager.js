

import DefaultPreference from 'react-native-default-preference';


export default class CommonDataManager {
    static myInstance = null;
    stringsData = null;

    static userLoggedIn = false
    _userID = "false";
    /**
     * @returns {CommonDataManager}
     */
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }
        return this.myInstance;
    }
    getData =  async() =>
    {
        resp = await DefaultPreference.get('loggedIn')
        console.log('resp',resp)
        this.userLoggedIn =  resp
        return resp
    }
    
    async getStrings() {
        if (this.stringsData == null) {
        let resp = await DefaultPreference.get('loggedIn')
        }
          return this.stringsData
      }
}