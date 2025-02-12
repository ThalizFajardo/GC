import bcrypt from "bcryptjs";
import { PostgresDatabase } from "../../data/postgres/postgres-database";
import { Pin } from "../../data/postgres/models/pin.model";


export class PinService {
    private pinRepository = PostgresDatabase.;

    async storePin(userId: string, pin: string): Promise<boolean> {
      if (!/^\d{6}$/.test(pin)) {
        throw new Error("El PIN debe tener exactamente 6 dígitos");
      }
  
      const hashedPin = await bcrypt.hash(pin, 10);
  
      const newPin = this.pinRepository.create({ user_id: userId, hashedPin });
  
      await this.pinRepository.save(newPin);
      return true;
    }
  
    async validatePin(userId: string, pin: string): Promise<boolean> {
      const storedPin = await this.pinRepository.findOne({ where: { user_id: userId } });
  
      if (!storedPin) {
        throw new Error("PIN no encontrado para este usuario");
      }
  
      const isMatch = await bcrypt.compare(pin, storedPin.hashedPin);
      return isMatch;
    }
}