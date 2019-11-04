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
Object.defineProperty(exports, "__esModule", { value: true });
const convert_trigger_1 = require("./convert_trigger");
const convert_condition_1 = require("./convert_condition");
const convert_action_1 = require("./convert_action");
exports.convertRule = (rule) => __awaiter(void 0, void 0, void 0, function* () {
    const automation = {};
    const trigger = yield convert_trigger_1.convertTrigger(rule);
    const condition = yield convert_condition_1.convertCondition(rule);
    const action = yield convert_action_1.convertAction(rule);
    if (trigger) {
        automation.trigger = [trigger];
    }
    if (condition) {
        automation.condition = condition;
    }
    if (action) {
        automation.action = action;
    }
    return automation;
});
//# sourceMappingURL=convert.js.map