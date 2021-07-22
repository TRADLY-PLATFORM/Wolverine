export default class ErrorHandler {
  static errorHandle(errorCode) {
      switch(errorCode) {
          case 101: return 'User already exist'
          case 102: return 'User not register'
          case 103: return 'invalid credentials'
          case 104: return 'Verification code is invalid'
          case 105: return 'INVALID CREDENTIALS'
          case 301: return 'User already exist'
          case 401: return 'Unauthorized'
          case 402: return 'Technical issue'
          default: return 'invalid or missing parameters' ;
          }
  }
}