export default class OrderStatusEnum {
  static code(type) {
    switch (type) { 
      case 1: return 'In Complete'
      case 2: return 'Order Placed Successfully'
      case 3: return 'Order In Process'
      case 4: return 'Shipped'
      case 5: return 'Customer UnReachable'
      case 6: return 'Out For Delivery'
      case 7: return 'Undeliverd Returned'
      case 8: return 'Undeliver Return Confirmed'
      case 9: return 'Order Deliverd'
      case 10: return 'Deliverd Confirmed'
      case 11: return 'Customer Return Initated'
      case 12: return 'Customer Return Picked'
      case 13: return 'Customer Return Confirmed'
      case 14: return 'Customer Return Disputed'
      case 15: return 'Canceled By Account'
      case 16: return 'Order Canceled'
      case 17: return 'Ready For Pickup'
      default: return 'Processing' ;
    }
  }
}

