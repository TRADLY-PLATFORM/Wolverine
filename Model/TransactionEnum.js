export default class TransactionEnum {
  static code(type) {
      switch(type) {
          case 1: return 'Sales'
          case 2: return 'Sales'
          case 5: return 'Commission Created'
          case 6: return 'Commision Canceled'
          case 7: return 'Transfer Created'
          case 8: return 'Transfer Canceled'
          case 10: return 'Subscription fee'
          case 11: return 'Processing fee'
          case 12: return 'Processing fee Canceled'
          default: return 'Sales Canceled' ;
          }
  }
}