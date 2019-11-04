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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rule_1 = require("./rule");
exports.convertCondition = (rule) => __awaiter(void 0, void 0, void 0, function* () {
    // Process the filter on the expression
    // This becomes the condition.
    if (!rule.table) {
        return;
    }
    const info = rule_1.getTableInfo(rule.table);
    if (!info.invocation) {
        return;
    }
    const kind = info.invocation.selector.kind;
    const channel = info.invocation.channel;
    let kindPackage;
    try {
        kindPackage = yield Promise.resolve().then(() => __importStar(require(`./device/${kind}`)));
    }
    catch (err) {
        console.warn(`Condition: Unknown kind ${kind}`);
        return;
    }
    if (!kindPackage.CONDITIONS) {
        console.warn(`Condition: Unsupported kind ${kind}`);
        return;
    }
    const channelFunc = kindPackage.CONDITIONS[channel];
    if (!channelFunc) {
        console.warn(`Condition: Unknown channel ${channel} for kind ${kind}`);
        return;
    }
    const condition = channelFunc(info);
    if (!condition) {
        // Assume condition already warned.
        return;
    }
    return condition;
});
//# sourceMappingURL=convert_condition.js.map