const http = require('http');

const eventName = `verify_${Date.now()}`;
const postData = JSON.stringify({
    event: eventName,
    value: 1
});

const postOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/track',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const regex = new RegExp(eventName);

console.log(`[TEST] Sending event: ${eventName}`);

const req = http.request(postOptions, (res) => {
    console.log(`[TEST] POST status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        // Now verify with GET
        console.log('[TEST] Checking system state...');
        http.get('http://localhost:3000/api/system', (res2) => {
            let data2 = '';
            res2.on('data', (chunk) => { data2 += chunk; });
            res2.on('end', () => {
                if (data2.includes(eventName)) {
                    console.log('[SUCCESS] Event found in system state. Firebase read/write verified.');
                } else {
                    console.log('[FAILURE] Event NOT found in system state.');
                    console.log('Partial Response:', data2.substring(0, 500));
                }
            });
        }).on('error', (e) => {
            console.error(`[ERROR] GET failed: ${e.message}`);
        });
    });
});

req.on('error', (e) => {
    console.error(`[ERROR] POST failed: ${e.message}`);
});

req.write(postData);
req.end();
