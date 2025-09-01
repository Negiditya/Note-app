const otpGenerator = require('otp-generator')
// fn to generate otp

const generateOtp = () => {
   return otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    })
}

module.exports = generateOtp