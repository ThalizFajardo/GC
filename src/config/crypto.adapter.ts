import crypto from "crypto";

export class CryptoAdapter {
  static encrypt(text: string, encryptionKey: string, ivLength: number = 16): string {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey, "hex"),
      iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")};${encrypted}`;
  }

  static decrypt(encryptedText: string, encryptionKey: string): string {
    const [ivHex, encrypted] = encryptedText.split(";");
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey, "hex"),
      iv
    );

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
