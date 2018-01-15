const crypto = require('crypto');
const secret = 'abcdefg';
/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', secret); /** Hashing algorithm sha512 */
    hash.update(password + salt);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);   
    return passwordData;
}

function verifyHashPassword(pwd, salt, hash){
    var passwordData = sha512(pwd, salt);  
    return (passwordData.passwordHash == hash)
}

module.exports = {
    createPassword: function (pwd) {
        return saltHashPassword(pwd);   
    },
    verifyPassword: function(pwd, salt, hash){
        return verifyHashPassword(pwd, salt, hash);
    }
}