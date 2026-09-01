#!/usr/bin/env node
// Verify Tradly endpoints from URLConstants vs developer.tradly.app (2026)
const fs = require('fs');

const OLD_BASE = 'https://api.dev.tradly.app/app/';
const NEW_BASE = 'https://api.tradly.app/';

// From Constants/URLConstants.js
const URLPaths = {
  token: 'v1/users/token/refresh',
  config: 'v1/tenants/eventdev/configs',
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
};

// From llms.txt / developer.tradly.app markdown
const NEW_DOCS = {
  // Auth
  register: 'POST /v1/users/register',
  login: 'POST /v1/users/login',
  verify: 'POST /v1/users/verify',
  forgotpassword: 'POST /v1/users/password/recovery',
  token: 'POST /v1/users/token/refresh',
  // Accounts
  accounts: 'GET /v1/accounts',
  // Listings - new docs use /v1/listings not products/v1/listings
  listings: 'GET /v1/listings',
  listings_list: 'GET /v1/listings',
  // Categories
  category: 'GET /v1/categories',
  // Attributes
  attribute: 'GET /v1/attributes',
  shippingMethod: 'GET /v1/tenants/shipping_methods',
  currencies: 'GET /v1/currencies',
  variantType: 'GET /v1/listings/variant_types OR products/v1/variant_types (legacy)',
};

const tests = [
  { key: 'config', path: URLPaths.config, method: 'GET', doc: 'GET /v1/tenants/{tenant}/configs (legacy, now 412 for eventdev)' },
  { key: 'login', path: URLPaths.login, method: 'POST', doc: NEW_DOCS.login, body: { user: { email: 'test@test.com', password: '123456', type: 'customer' } } },
  { key: 'register', path: URLPaths.register, method: 'POST', doc: NEW_DOCS.register },
  { key: 'verify', path: URLPaths.verify, method: 'POST', doc: NEW_DOCS.verify },
  { key: 'forgotpassword', path: URLPaths.forgotpassword, method: 'POST', doc: NEW_DOCS.forgotpassword },
  { key: 'category', path: URLPaths.category + 'listings', method: 'GET', doc: NEW_DOCS.category },
  { key: 'attribute', path: URLPaths.attribute + '1', method: 'GET', doc: NEW_DOCS.attribute },
  { key: 'accounts', path: URLPaths.accounts, method: 'GET', doc: NEW_DOCS.accounts },
  { key: 'listings', path: URLPaths.listings, method: 'GET', doc: NEW_DOCS.listings + ' (legacy products/v1/listings vs new v1/listings)' },
  { key: 'listings_new', path: 'v1/listings', method: 'GET', doc: NEW_DOCS.listings },
  { key: 'currencies', path: URLPaths.currencies, method: 'GET', doc: NEW_DOCS.currencies },
  { key: 'variantType', path: URLPaths.variantType, method: 'GET', doc: NEW_DOCS.variantType },
  { key: 'token', path: URLPaths.token, method: 'POST', doc: NEW_DOCS.token },
];

async function hit(base, p, method, body) {
  const url = base + p;
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const start = Date.now();
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = text.slice(0,500); }
    return { url, status: res.status, ok: res.ok, time: Date.now()-start, json };
  } catch (e) {
    return { url, error: e.message, time: Date.now()-start };
  }
}

(async () => {
  console.log('=== Tradly Endpoint Verification ===');
  console.log(`OLD_BASE: ${OLD_BASE} (DEAD - DNS fails)`);
  console.log(`NEW_BASE: ${NEW_BASE} (prod, tenant eventdev -> 412)`);
  console.log(`Date: ${new Date().toISOString()}\n`);

  console.log('--- URLConstants vs Docs ---');
  for (const [k,v] of Object.entries(URLPaths)) {
    const doc = NEW_DOCS[k] || '—';
    const flag = k === 'listings' && v.startsWith('products/') ? '⚠️  LEGACY' : (v.includes('eventdev') ? '⚠️ TENANT' : '✓');
    console.log(`${flag} ${k.padEnd(18)} ${v.padEnd(45)} | doc: ${doc}`);
  }
  console.log('\n--- Live Probe (NEW_BASE) ---');
  for (const t of tests) {
    const r = await hit(NEW_BASE, t.path, t.method, t.body);
    const icon = r.error ? '❌' : r.status === 412 && t.key === 'config' ? '⚠️' : r.status === 401 ? '🔒' : r.ok ? '✓' : '❓';
    console.log(`${icon} ${t.key.padEnd(15)} ${t.method.padEnd(6)} ${NEW_BASE+t.path}`);
    console.log(`   doc: ${t.doc}`);
    if (r.error) console.log(`   → ERROR: ${r.error}`);
    else {
      console.log(`   → ${r.status} ${r.statusText || ''} (${r.time}ms)`);
      const j = typeof r.json === 'string' ? r.json : JSON.stringify(r.json).slice(0,300);
      console.log(`   → body: ${j}`);
    }
  }
  console.log('\n--- Old Base Probe (should fail DNS) ---');
  const oldR = await hit(OLD_BASE, 'v1/tenants/eventdev/configs', 'GET');
  console.log(oldR.error ? `❌ OLD_BASE dead: ${oldR.error}` : `→ ${oldR.status}`);

  console.log('\n--- Recommendations ---');
  console.log('1. BaseURL: update Constants/URLConstants.js BaseURL from api.dev.tradly.app/app/ to https://api.tradly.app/');
  console.log('2. Config endpoint eventdev is gone on prod (412). Use demo fallback or configure workspace domain + publishable key (see Tradly Boilerplate .env.example)');
  console.log('3. Listings: migrate products/v1/listings -> v1/listings (new docs)');
  console.log('4. Login payload: old uses {user:{uuid,type,email,password}} + Bearer bToken; new uses {user:{email,password}} + Bearer publishable_key. Add demo bypass for 805/NetworkError');
  console.log('5. All UI spinners should use overlay outside ScrollView with finally{} to avoid stuck loading');
})();
