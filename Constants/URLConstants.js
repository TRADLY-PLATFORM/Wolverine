module.exports = {
  URLPaths: {
    BaseURL: 'https://api.tradly.app/app/',
    token: 'v1/users/token/refresh',
    config: 'v1/tenants/classbubs/configs',
    register: 'v1/users/register',
    login: 'v1/users/login',
    verify: 'v1/users/verify',
    forgotpassword: 'v1/users/password/recovery',
    category:'v1/categories?parent=0&type=',
    attribute:'v1/attributes/?category_id=',
    shippingMethod: 'v1/tenants/shipping_methods',
    searchAddress: 'v1/addresses/search?key=',
    S3signedUploadURL: 'v1/utils/S3signedUploadURL',
    accounts: 'v1/accounts',
    listings: 'products/v1/listings',
    currencies: 'v1/currencies',
    variantType: 'products/v1/variant_types',
    home: 'products/v1/home',
  }
}