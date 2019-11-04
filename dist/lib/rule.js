"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamValue = (in_params, name) => {
    for (const param of in_params) {
        if (param.name === name) {
            return param.value.value;
        }
    }
};
exports.getTableInfo = (table) => {
    const info = {
        filters: []
    };
    while (table) {
        if (table.filter) {
            info.filters.push(table.filter);
        }
        if (table.invocation) {
            info.invocation = table.invocation;
        }
        table = table.table;
    }
    return info;
};
//# sourceMappingURL=rule.js.map