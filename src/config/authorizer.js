import crypto from 'crypto';

function generateHMACSignature({ secretKey, timestamp, params, body }) {
    // Validate inputs
    if (!secretKey || !timestamp) {
        throw new Error('Missing required signature components');
    }

    params = params || {};
    body = body || {};
    // Normalize inputs
    const normalizedParams = params ? (typeof params === 'string' ? params : JSON.stringify(sortObjectKeys(params))) : '';
    const normalizedBody = body ?
        (typeof body === 'string' ? body : JSON.stringify(sortObjectKeys(body))) : '';

    // Create signature payload
    const signaturePayload = `${timestamp}.${normalizedParams}.${normalizedBody}`;
    // console.log("Signature payload is", signaturePayload);

    // Generate HMAC
    return crypto
        .createHmac('sha256', secretKey)
        .update(signaturePayload)
        .digest('hex');
}

// Helper to sort object keys for consistent stringification
function sortObjectKeys(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
            acc[key] = obj[key];
            return acc;
        }, {});
}

// Verification function
function verifyHMAC({ receivedSig, secretKey, timestamp, params, body }) {
    const computedSig = generateHMACSignature({ secretKey, timestamp, params, body });
    const receivedBuf = Buffer.from(receivedSig, 'hex');
    const computedBuf = Buffer.from(computedSig, 'hex');

    if (receivedBuf.length !== computedBuf.length) {
        return false;
    }

    return crypto.timingSafeEqual(receivedBuf, computedBuf);
}

const authorizer = (req, res, next) => {
    const authToken = req.headers['x-api-key'];
    const clientSignature = req.headers['x-signature'];
    const timestamp = req.headers['x-timestamp'];

    // Check for missing headers
    if (!authToken || !clientSignature || !timestamp) {
        return res.status(401).json({ error: 'Unauthorized: Missing headers' });
    }

    // Verify the authorization token
    if (authToken !== process.env.APP_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }


    // Verify the timestamp (e.g., allow a 5-minute window)
    const requestTime = parseInt(timestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - requestTime) > 300) {
        return res.status(401).json({ error: 'Unauthorized: Request expired' });
    }

    const secretKey = process.env.APP_SECRET_KEY;
    const body = req.body;
    const params = req.params;
    const serverSignature = generateHMACSignature({ secretKey, timestamp, params, body });
    // console.log("Server Signature is", serverSignature);
    if(!verifyHMAC({ receivedSig: clientSignature, secretKey, timestamp, params, body })) {
        return res.status(401).json({ error: 'Unauthorized: Invalid signature' });
    }

    next();
};

export default authorizer;