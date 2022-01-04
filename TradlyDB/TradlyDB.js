import PouchDB from 'pouchdb-react-native'

const tradlyDB = new PouchDB('tdb');  

class TradlyDB {
  saveDataInDB = async (key, value) => {
    let dic = {
      [`${key}`] : value,
      _id:key,
    }
    tradlyDB.put(dic, function(err,resp) {
      if (err) {
        //  console.log('saving error',err.status);
      } else {
        dic._rev = resp._rev
        console.log("Document created Successfully");
      }
    })
  }
  getDataFromDB = async(key) => {
    try {
      var doc = await tradlyDB.get(key)
      tradlyDB.remove(doc);
      return doc[key];
    } catch (err) {
      console.log(err);
    }
  }
}
const TradlyDb = new TradlyDB();
export default TradlyDb;