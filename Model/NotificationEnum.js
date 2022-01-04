
export default class TransactionEnum {
  static type(type) {
    switch (type) {
      case 1: return 'started following you'
      case 2: return 'liked your item'
      case 3: return 'order received'
      default: return 'Sales Canceled';
    }
  }
}
// Activities Type
ACTIVITY_TYPE_ACCOUNT_FOLLOW = 1
ACTIVITY_TYPE_LIKE_LISTING = 2
ACTIVITY_TYPE_ORDER_STATUS_CHANGE = 3

// Activity Reference Type
ACTIVITY_REFERENCE_TYPE_ACCOUNT = 1
ACTIVITY_REFERENCE_TYPE_LISTING = 2
ACTIVITY_REFERENCE_TYPE_ORDER = 3