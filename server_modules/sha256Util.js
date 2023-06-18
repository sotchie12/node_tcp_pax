var crypto = require('crypto')

async function getCheckSum(str) {
    return crypto
        .createHash('sha256')
        .update(str, 'utf8')
        .digest('hex')
}

module.exports = { getCheckSum }