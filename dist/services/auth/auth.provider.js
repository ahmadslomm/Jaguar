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
exports.getUserRegistration = exports.register = void 0;
const user_schema_1 = require("../../schema/user.schema");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
const Enum_1 = require("../../utils/Enum");
const function_1 = require("../../helper/function");
const createToken_1 = require("../../middleware/authentication/createToken");
const register = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        let checkAvlUser = yield user_schema_1.User.findOne({ where: { telegramId: +(payload === null || payload === void 0 ? void 0 : payload.telegramId) } });
        if (!checkAvlUser) {
            yield (0, function_1.createUser)(payload);
        }
        ;
        yield (0, function_1.updateLeagueLevel)(payload === null || payload === void 0 ? void 0 : payload.telegramId);
        const jsonToken = yield (0, createToken_1.createJsonWebToken)({ userId: checkAvlUser === null || checkAvlUser === void 0 ? void 0 : checkAvlUser.id, telegramId: payload === null || payload === void 0 ? void 0 : payload.telegramId });
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.CREATED, true, "User registration checked successfully", jsonToken);
    }
    catch (error) {
        console.log("Getting error for  checking the user's registration :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.register = register;
const getUserRegistration = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield user_schema_1.User.findAll({ raw: true });
        console.log("getting user token ifo registration", userData);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.CREATED, true, "User details fetched successfully", userData);
    }
    catch (error) {
        console.log("Getting error for getting user registration :", error);
        return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
    }
});
exports.getUserRegistration = getUserRegistration;
