var aesjs: typeof import("aes-js");

class CUtils {
    private static readonly toBytes = aesjs.utils.utf8.toBytes;
    private static readonly B_KEY = this.toBytes(
        "e3ded030ce294235047550b8f69f5a28"
    );
    private static readonly B_IV = this.toBytes("e0b2ea987a832e24");

    static encrypt(text: string) {
        let aesCbc = new aesjs.ModeOfOperation.cbc(this.B_KEY, this.B_IV);
        let data = this.toBytes(text);
        let padded = aesjs.padding.pkcs7.pad(data);
        let encryptedBytes = aesCbc.encrypt(padded);

        return this.bytesTob64(encryptedBytes);
    }

    static decrypt(base64: string) {
        let aesCbc = new aesjs.ModeOfOperation.cbc(this.B_KEY, this.B_IV);
        let encryptedBytes = this.b64ToBytes(base64);
        let padded = aesCbc.decrypt(encryptedBytes);
        let data = aesjs.padding.pkcs7.strip(padded);

        return aesjs.utils.utf8.fromBytes(data);
    }

    private static bytesTob64(bytes: Uint8Array) {
        return Utilities.base64Encode(Array.from(bytes));
    }
    private static b64ToBytes(base64: string) {
        const binString = Utilities.base64Decode(base64);
        return Uint8Array.from(binString);
    }
}

function testEncryption() {
    Logger.log(CUtils.encrypt("1155123456") === "6EetOLHcc/21NlcPWET9xA==");
    Logger.log(CUtils.decrypt("Xzig8C7wHZ8830nzJUog1Q==") === "test");
}
