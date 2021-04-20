const twilio = require('twilio');
const { ModelBuildContext } = require('twilio/lib/rest/autopilot/v1/assistant/modelBuild');

class Twilio{
    phoneNumber = '+1 571 200 8463';
    phoneNumberSid = 'PNb9f3a6a013ffe38e20baf17ca36c10b6';
    tokenSid = 'SK77438c30a99c2eb17a193c9ff1a29839';
    tokenSecret = 'DO396ZxSmrFIfhu72s14jv98kbidml05';
    accountSid = 'AC06877d37b0d2120db5ca552b630ed58d';
    verify = 'VA4b8e1184927b07159da832bdaa426095';
    client;
    constructor(){
        this.client = twilio(this.tokenSid, this.tokenSecret, {
            accountSid: this.accountSid,
        });
    }
    getTwilio(){
        this.client;
    }

    async sendVerifyAsync(to, channel){
        const data = await this.client.verify
        .services(this.verify)
        .verifications.create({
            to,
            channel,
        });
        console.log('sendVerify:');
        return data;
    }

    async verifyCodeAsync(to, code){
        const data = await this.client.verify
        .services(this.verify)
        .verificationChecks.create({
            to,
            code,
        });
        console.log('verifyCode');
        return data;
    }
}

const instance = new Twilio()
Object.freeze(instance);

module.exports = instance
