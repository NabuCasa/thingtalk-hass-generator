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
const js_yaml_1 = __importDefault(require("js-yaml"));
const parse_1 = require("./lib/parse");
const convert_1 = require("./lib/convert");
const readline_1 = __importDefault(require("readline"));
function printRule(rule) {
    return __awaiter(this, void 0, void 0, function* () {
        let haSyntax = yield convert_1.convertRule(rule);
        if (!haSyntax.trigger) {
            // This is a script.
            if (haSyntax.condition) {
                console.warn("Creating a script. All conditions are lost because we do not yet support device conditions in scripts.");
                console.log();
                delete haSyntax.condition;
            }
            haSyntax.script = haSyntax.action;
            delete haSyntax.action;
            console.log("Home Assistant Script:");
        }
        else {
            console.log("Home Assistant Automation:");
        }
        console.log();
        console.log(js_yaml_1.default.safeDump(haSyntax));
    });
}
function printProgram(program) {
    debugger;
    for (const rule of program.rules) {
        printRule(rule);
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const linereader = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        function ask() {
            linereader.question(`What is your command?\n`, (utterance) => __awaiter(this, void 0, void 0, function* () {
                utterance = utterance.trim();
                if (utterance === "") {
                    linereader.close();
                    return;
                }
                console.log();
                const ast = yield parse_1.parseUtterance(utterance);
                if (ast == null) {
                    linereader.close();
                    return;
                }
                printProgram(ast);
                console.log();
                setTimeout(ask, 0);
            }));
        }
        ask();
    });
}
main();
//# sourceMappingURL=demo.js.map