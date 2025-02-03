import { DataSource } from "typeorm";
import { User } from "./models/user.model";
import { SecurityBox } from "./models/security-box.model";
import { Pin } from "./models/pin.model";
import { CredentialStorage } from "./models/credetia-storage";


interface Options {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export class PostgresDatabase {
    public datasource: DataSource;

    constructor(options: Options) {
        this.datasource = new DataSource({
            type: 'postgres',
            host: options.host,
            port: options.port,
            username: options.username,
            password: options.password,
            database: options.database,
            entities :[User, SecurityBox, Pin,CredentialStorage], 
            synchronize: true,
            ssl:{
                rejectUnauthorized: false
            }
        });
    }

    async connect() {
        try {
            await this.datasource.initialize()
            console.log("🎉✨ The database has been successfully connected: Everything is ready to go! 🌟😀")
        } catch (error) {
            console.log(error)
        }
    }
}

