export default class ConversationModel {
  static data(object) {
    let object = Object.keys(snapshot.val())
    let dataObj = Object.values(snapshot.val())
    console.log('dataObj: ', dataObj);

    console.log('key: ', object);
    // let dataObj = 
    // let dic = {
    //   'chatrooms': object[0],
    //   'name'
    // }
  }
}