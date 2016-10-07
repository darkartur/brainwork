import Ticket from "../../../src/ticket";

export interface DataBaseService {
    loadAll(): Promise<Ticket[]>;
    loadOne(id: string): Ticket;
    create(): Ticket;
    loadDescription(filename: string): string;
    saveDescription(filename: string, description: string);
    loadFilenames(): string[];
}
