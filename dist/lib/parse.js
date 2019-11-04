"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const thingtalk_1 = __importDefault(require("thingtalk"));
const schema_retriever_1 = require("./schema_retriever");
exports.parseUtterance = (utterance) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://almond-nl.stanford.edu/en-US/query`, {
        params: {
            q: utterance,
            thingtalk_version: "1.8.0"
        }
    });
    if (response.data.candidates.length === 0) {
        console.error("Unable to parse utterance!");
        return null;
    }
    console.log(response.data.candidates[0].code.join(" "));
    console.log(response.data.entities);
    console.log();
    const ast = thingtalk_1.default.NNSyntax.fromNN(response.data.candidates[0].code, response.data.entities);
    yield ast.typecheck(schema_retriever_1.schemaRetriever);
    return ast;
});
//# sourceMappingURL=parse.js.map