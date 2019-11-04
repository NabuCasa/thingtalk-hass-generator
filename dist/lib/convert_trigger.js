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
exports.convertTrigger = (rule) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for a trigger
    if (!rule.stream) {
        return;
    }
    // Gather stream info
    let stream = rule.stream;
    const info = {
        filters: []
    };
    while (stream) {
        const type = stream.constructor.className;
        if (stream.filter) {
            info.filters.push(stream.filter);
        }
        switch (type) {
            case "Monitor":
                const tableInfo = rule_1.getTableInfo(stream.table);
                info.filters.push(...tableInfo.filters);
                if (tableInfo.invocation) {
                    info.invocation = tableInfo.invocation;
                }
                break;
            case "EdgeFilter":
                // Nothing to do
                break;
            default:
                console.warn("Unknown type", type);
        }
        stream = stream.stream;
    }
    if (!info.invocation) {
        return;
    }
    // convert stream info to automation trigger
    const kind = info.invocation.selector.kind;
    const channel = info.invocation.channel;
    let kindPackage;
    try {
        kindPackage = yield Promise.resolve().then(() => __importStar(require(`./device/${kind}`)));
    }
    catch (err) {
        console.warn(`Trigger: Unknown kind ${kind}`);
        return;
    }
    if (!kindPackage.TRIGGERS) {
        console.warn(`Trigger: Unsupported kind ${kind}`);
        return;
    }
    const channelFunc = kindPackage.TRIGGERS[channel];
    if (!channelFunc) {
        console.warn(`Trigger: Unknown channel ${channel} for kind ${kind}`);
        return;
    }
    const trigger = channelFunc(info);
    if (!trigger) {
        // Assume trigger already warned.
        return;
    }
    return trigger;
});
//# sourceMappingURL=convert_trigger.js.map