"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenResObj = void 0;
const GenResObj = (code, success, message, data) => {
    return {
        code,
        data: {
            success,
            message,
            data,
        },
    };
};
exports.GenResObj = GenResObj;
