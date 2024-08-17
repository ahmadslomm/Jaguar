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
exports.authCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("../../schema/user.schema");
const Enum_1 = require("../../utils/Enum");
const ResponseFormat_1 = require("../../utils/ResponseFormat");
;
const authCheck = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let jwtToken;
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                jwtToken = req.headers.authorization.split(' ')[1];
            }
            ;
            // console.log("2")
            if (!jwtToken) {
                return res.status(Enum_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Access token not found",
                    data: null
                });
            }
            ;
            const secretKey = process.env.JWT_SECRET_KEY;
            jsonwebtoken_1.default.verify(jwtToken, secretKey, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return res.status(Enum_1.HttpStatusCodes.UNAUTHORIZED).json({
                        success: false,
                        message: "Invalid token",
                        data: null
                    });
                }
                else {
                    if (decoded !== null) {
                        const user = yield user_schema_1.User.findOne({ where: { telegramId: decoded === null || decoded === void 0 ? void 0 : decoded.telegramId } });
                        if (!user) {
                            return res.status(Enum_1.HttpStatusCodes.UNAUTHORIZED).json({
                                success: false,
                                message: "User not found",
                                data: null
                            });
                        }
                        ;
                        // console.log("object: ", user )
                        req.userId = user === null || user === void 0 ? void 0 : user.id;
                        req.telegramId = user === null || user === void 0 ? void 0 : user.telegramId;
                        next();
                    }
                    else {
                        return res.status(Enum_1.HttpStatusCodes.NOT_FOUND).json({
                            success: false,
                            message: "Telegram ID not found",
                            data: null
                        });
                    }
                }
            }));
        }
        catch (error) {
            console.log("Getting error for checking auth middleware :", error);
            return (0, ResponseFormat_1.GenResObj)(Enum_1.HttpStatusCodes.INTERNAL_SERVER, false, "Internal server error", null);
        }
    });
};
exports.authCheck = authCheck;
