const sha = require('sha.js');
      hashLength = 64;

function hashWithSalt(str, salt) {
    const preHash = str + salt;
    const hash = sha('sha256').update(preHash).digest('hex');
    const pwHash = hash + salt;
    return pwHash
}

module.exports = {
    getHashWithSalt: str => {
        const salt = Date.now().toString(16);
        const pwHash = hashWithSalt(str, salt);
        return pwHash;
    },
    comparePassword: (pwIn, pwSaved) => {
        const salt = pwSaved.substring(hashLength, pwSaved.length);
        const pwHash = hashWithSalt(pwIn, salt);
        return pwHash === pwSaved;
    }
};
