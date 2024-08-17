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
exports.createJsonWebToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJsonWebToken = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const maxAge = 30 * 24 * 60 * 60; //valid for 30days
        const secretKey = process.env.JWT_SECRET_KEY;
        const token = yield jsonwebtoken_1.default.sign(userInfo, secretKey, {
            expiresIn: maxAge,
        });
        // return `Bearer ${token}`;
        return `${token}`;
    }
    catch (error) {
        console.log("Getting error for creating json web token : ", error);
        throw error;
    }
});
exports.createJsonWebToken = createJsonWebToken;
