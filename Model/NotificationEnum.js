
export default class TransactionEnum {
  static type(type, translationDic) {
    if (type == 1) {
      let rep = translationDic['started_following_your_account'] ?? ''
      let str = rep.replace('{value}', ``)
      return str;
    } else if (type == 2) {
      let rep = translationDic['liked_your_listing'] ?? ''
      let str = rep.replace('{value}', ``)
      return str;
    } else {
      switch (type) {
        case 1: return 'started following you'
        case 2: return 'liked your item'
        case 3: return 'order received'
        default: return 'Sales Canceled';
      }
    }
  }
}
  //     case 7: return 'Undeliverd Returned'
  //     case 8: return 'Undeliver Return Confirmed'
  //     case 9: return 'Order Delivered'
  //     case 10: return 'Delivered Confirmed'
  //     case 11: return 'Customer Return Initated'
  //     case 12: return 'Customer Return Picked'
  //     case 13: return 'Customer Return Confirmed'
  //     case 14: return 'Customer Return Disputed'
  //     case 15: return 'Canceled By Account'
  //     case 16: return 'Order Canceled'
  //     case 17: return 'Ready For Pickup'
  //     default: return 'Processing' ;
  //   }
// case inComplete = 1
// case placedSuccess = 2
// case inProcess = 3
// case shipped = 4
// case customerUnReachable = 5
// case outForDelivery = 6
// case undeliverdReturned = 7
// case undeliverReturnConfirmed = 8
// case deliverd = 9
// case deliverdConfirmed = 10
// case customerReturnInitated = 11
// case customerReturnPicked = 12
// case customerReturnConfirmed = 13
// case customerReturnDisputed = 14
// case canceledByAccount = 15
// case canceledByCustomer = 16
// case readyForPickup = 17
// Activities Type
ACTIVITY_TYPE_ACCOUNT_FOLLOW = 1
ACTIVITY_TYPE_LIKE_LISTING = 2
ACTIVITY_TYPE_ORDER_STATUS_CHANGE = 3

// Activity Reference Type
ACTIVITY_REFERENCE_TYPE_ACCOUNT = 1
ACTIVITY_REFERENCE_TYPE_LISTING = 2
ACTIVITY_REFERENCE_TYPE_ORDER = 3