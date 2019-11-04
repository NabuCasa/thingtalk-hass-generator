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
exports.convertAction = (rule) => __awaiter(void 0, void 0, void 0, function* () {
    // Process the action
    if (!rule.actions) {
        return;
    }
    const actions = [];
    for (const action of rule.actions) {
        const kind = action.invocation.selector.kind;
        const channel = action.invocation.channel;
        let kindPackage;
        try {
            kindPackage = yield Promise.resolve().then(() => __importStar(require(`./device/${kind}`)));
        }
        catch (err) {
            console.warn(`Action: Unknown kind ${kind}`);
            continue;
        }
        if (!kindPackage.ACTIONS) {
            console.warn(`Action: Unsupported kind ${kind}`);
            return;
        }
        const channelFunc = kindPackage.ACTIONS[channel];
        if (!channelFunc) {
            console.warn(`Action: Unknown channel ${channel} for kind ${kind}`);
            continue;
        }
        const automationAction = channelFunc(action);
        if (!automationAction) {
            // Assume trigger already warned.
            continue;
        }
        actions.push(automationAction);
    }
    if (actions.length > 0) {
        return actions;
    }
});
//# sourceMappingURL=convert_action.js.map