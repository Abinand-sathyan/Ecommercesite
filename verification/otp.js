const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const verifySid = process.env.VERIFY_SERVICE;


const client = require('twilio')(accountSid, authToken);

function sendotp(sendotpphone){
    console.log("shjsbdhvksabuks")
    client.verify.v2
    .services(verifySid)
    .verifications.create({ to:`+91${sendotpphone}`, channel: "sms" })
    .then((verification) => console.log(verification.status));
    console.log(sendotpphone);
    console.log(sendotpphone,".......................")
    console.log("w8ing.......")

}

function verifyotp(phone,otp){
    console.log(phone);
    return new Promise((resolve,reject)=>{
    client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: `+91${phone}`, code: otp })
    .then((verification_check) => {console.log(verification_check.status)
     resolve(verification_check)})
        })
  

}

module.exports= {
    sendotp,
    verifyotp

}
