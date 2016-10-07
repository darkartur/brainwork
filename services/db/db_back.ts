import Ticket, {DIRECTORY} from "../../../src/ticket";
import * as fs from 'fs';
import { DataBaseService } from "./db";

export default class DataBaseBackService implements DataBaseService {

    loadAll(): Promise<Ticket[]> {
        return Promise.resolve(Ticket.loadAll(this));
    }

    loadOne(id: string): Ticket {
        return Ticket.loadOne(this, id);
    }

    create(): Ticket {
        return Ticket.create(this);
    }

    loadDescription(filename: string): string {
        if (fs.existsSync(filename)) {
            return fs.readFileSync(filename).toString();
        }
    }

    saveDescription(filename: string, description: string) {
        fs.writeFileSync(filename, description);
    }

    loadFilenames(): string[] {
        return fs.readdirSync(DIRECTORY).map(Ticket.normalizeFilename)
    }
    
}

