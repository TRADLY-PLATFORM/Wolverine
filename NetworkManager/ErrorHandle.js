export default class ErrorHandler {
  static errorHandle(errorCode,message) {
      switch(errorCode) {
          case 101: return 'User already exist'
          case 102: return 'User not register'
          case 103: return 'invalid credentials'
          case 104: return 'Verification code is invalid'
          case 105: return 'INVALID CREDENTIALS'
          case 301: return 'User already exist'
          case 401: return 'Unauthorized'
          case 402: return 'Technical issue'
          case 753: return 'Action not allowed'
          case 480: return  480
          default: return message;
          }
  }
}