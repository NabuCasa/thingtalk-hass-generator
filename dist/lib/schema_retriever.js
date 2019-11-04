"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const thingtalk_1 = __importDefault(require("thingtalk"));
const thingpedia_1 = __importDefault(require("thingpedia"));
const path_1 = __importDefault(require("path"));
const root = path_1.default.dirname(path_1.default.dirname(__dirname));
exports.schemaRetriever = new thingtalk_1.default.SchemaRetriever(new thingpedia_1.default.FileClient({
    locale: "en_US",
    thingpedia: path_1.default.join(root, "/thingpedia.tt")
}), null, true);
//# sourceMappingURL=schema_retriever.js.map