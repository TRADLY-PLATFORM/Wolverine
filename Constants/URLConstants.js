import appConstant from './AppConstants';

module.exports = {
  URLPaths: {
    BaseURL: 'https://api.dev.tradly.app/',
    token: 'v1/users/token/refresh',
    config: `v1/tenants/${appConstant.tenantID}/configs`,
    configList: `v1/configs?key_group=`,
    register: 'v1/users/register',
    login: 'v1/users/login',
    verify: 'v1/users/verify',
    users: 'v1/users/',
    devices: 'v1/devices',
    forgotpassword: 'v1/users/password/recovery',
    category:'v1/categories?parent=0&type=',
    getAttribute: 'v1/attributes/?type=listings',
    attribute:'v1/attributes/?category_id=',
    shippingMethod: 'v1/tenants/shipping_methods',
    searchAddress: 'v1/addresses/search?key=',
    S3signedUploadURL: 'v1/utils/S3signedUploadURL',
    accounts: 'v1/accounts',
    listings: 'products/v1/listings',
    currencies: 'v1/currencies',
    variantType: 'products/v1/variant_types',
    home: 'products/v1/home',
    paymentMethod: '/v1/tenants/payment_methods',
    checkOut: '/checkout',
    myOrders: 'products/v1/orders?page=',
    orderDetail:'products/v1/orders/',
    createAccountLink: 'v1/payments/stripe/connect/account_links',
    createExpressLoginLink: 'v1/payments/stripe/connect/login_links',
    stripeConnectAccount: 'v1/payments/stripe/connect/account?account_id=',
    ephemeralKey:'v1/payments/stripe/ephemeralKey',
    paymentIntent:'v1/payments/stripe/paymentIntent',
    earning: 'v1/earnings?account_id=',
    transaction: 'v1/transactions?per_page=30&super_type=2&page=',
    like: '/likes',
    follow: '/follow',
    activities: 'v1/activities?page=',
    schedules: '/schedules',
    schedulesPerDay: 'schedules_per_day?',
    cart: 'products/v1/cart',
    addresses: 'v1/addresses'
  }
}
// BaseURL: 'https://api.tradly.app/app/',
// token: 'v1/users/token/refresh',
// config: 'v1/tenants/classbubs/configs',


//eventdev