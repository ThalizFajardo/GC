import crypto from "crypto";

export class CryptoAdapter {
 
    static encrypt(text: string, encryptionKey: string, ivLength: number): string {
        const iv = crypto.randomBytes(ivLength);
        const cipher = crypto.createCipheriv(
            "aes-256-cbc",
            Buffer.from(encryptionKey, "hex"),
            iv
        );

        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");

        return `${iv.toString("hex")}:${encrypted}`;
    }
}
