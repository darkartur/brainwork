"use strict";
const ticket_1 = require("../../../src/ticket");
const fs = require('fs');
class DataBaseBackService {
    loadAll() {
        return Promise.resolve(ticket_1.default.loadAll(this));
    }
    loadOne(id) {
        return ticket_1.default.loadOne(this, id);
    }
    create() {
        return ticket_1.default.create(this);
    }
    loadDescription(filename) {
        if (fs.existsSync(filename)) {
            return fs.readFileSync(filename).toString();
        }
    }
    saveDescription(filename, description) {
        fs.writeFileSync(filename, description);
    }
    loadFilenames() {
        return fs.readdirSync(ticket_1.DIRECTORY).map(ticket_1.default.normalizeFilename);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataBaseBackService;
//# sourceMappingURL=db_back.js.map