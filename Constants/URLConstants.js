module.exports = {
  URLPaths: {
    BaseURL: 'https://api.dev.tradly.app/app/v1/',
    config: 'tenants/eventdev/configs',
    register: 'users/register',
    login: 'users/login',
    verify: 'users/verify',
    forgotpassword: 'users/password/recovery',
    category:'categories?parent=0&type=',
    attribute:'attributes/?type=accounts&category_id=',
    shippingMethod: 'tenants/shipping_methods',
    searchAddress: 'addresses/search?key=',
    S3signedUploadURL: 'utils/S3signedUploadURL',
    accounts: 'accounts',
    
  }
}