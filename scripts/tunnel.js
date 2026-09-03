const localtunnel = require('localtunnel');
const https = require('https');

function getPublicIp() {
  return new Promise((resolve) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).ip);
        } catch {
          resolve('Unknown');
        }
      });
    }).on('error', () => resolve('Unknown'));
  });
}

(async () => {
  const ip = await getPublicIp();
  console.log(`\n=======================================================`);
  console.log(`🌐 FLEXGEAR LIVE PUBLIC TUNNELS`);
  console.log(`🔑 Tunnel IP / Password (if prompted by loca.lt): ${ip}`);
  console.log(`=======================================================`);

  // Customer Web (Port 3000)
  try {
    const customerTunnel = await localtunnel({ port: 3000 });
    console.log(`\n🛍️  Customer Web Live URL:\n👉 ${customerTunnel.url}`);
    
    customerTunnel.on('close', () => {
      console.log('Customer tunnel closed');
    });
  } catch (err) {
    console.error('Customer tunnel error:', err.message);
  }

  // Admin Web (Port 3001)
  try {
    const adminTunnel = await localtunnel({ port: 3001 });
    console.log(`\n📊 Admin Dashboard Live URL:\n👉 ${adminTunnel.url}`);

    adminTunnel.on('close', () => {
      console.log('Admin tunnel closed');
    });
  } catch (err) {
    console.error('Admin tunnel error:', err.message);
  }

  // Backend API (Port 5000)
  try {
    const apiTunnel = await localtunnel({ port: 5000 });
    console.log(`\n🔌 Backend API Live URL:\n👉 ${apiTunnel.url}`);

    apiTunnel.on('close', () => {
      console.log('API tunnel closed');
    });
  } catch (err) {
    console.error('API tunnel error:', err.message);
  }

  console.log(`\n=======================================================\n`);
})();
