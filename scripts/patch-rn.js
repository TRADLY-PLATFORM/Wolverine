const fs = require('fs');
const path = require('path');

function patchFmt() {
  const fmtPath = path.join(__dirname, '..', 'node_modules/react-native/third-party-podspecs/fmt.podspec');
  const follyPath = path.join(__dirname, '..', 'node_modules/react-native/third-party-podspecs/RCT-Folly.podspec');
  if (fs.existsSync(fmtPath)) {
    let c = fs.readFileSync(fmtPath, 'utf8');
    if (c.includes('"11.0.2"')) {
      c = c.replace(/spec\.version = "11\.0\.2"/, 'spec.version = "11.1.4"');
      c = c.replace(/:tag => "11\.0\.2"/, ':tag => "11.1.4"');
      fs.writeFileSync(fmtPath, c);
      console.log('[patch] fmt.podspec 11.0.2 -> 11.1.4');
    }
  }
  if (fs.existsSync(follyPath)) {
    let c = fs.readFileSync(follyPath, 'utf8');
    if (c.includes('"fmt", "11.0.2"')) {
      c = c.replace(/spec\.dependency "fmt", "11\.0\.2"/, 'spec.dependency "fmt", "11.1.4"');
      fs.writeFileSync(follyPath, c);
      console.log('[patch] RCT-Folly.podspec fmt 11.0.2 -> 11.1.4');
    }
  }
}

patchFmt();
