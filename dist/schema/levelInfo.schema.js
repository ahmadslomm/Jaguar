"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const levelInfoSchema = new mongoose_1.Schema({
    level: {
        type: Number,
        required: true
    },
    levelName: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const collectionName = 'levelInfo';
const LevelInfo = (0, mongoose_1.model)(collectionName, levelInfoSchema);
exports.default = LevelInfo;
