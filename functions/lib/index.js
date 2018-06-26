"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const cheerio = require("cheerio");
const node_fetch_1 = require("node-fetch");
exports.schedule = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        const data = yield node_fetch_1.default("https://gamesdonequick.com/schedule");
        const html = yield data.text();
        const $ = cheerio.load(html);
        const now = new Date();
        const now_utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        const allRuns = $(".start-time")
            .map((i, el) => ({
            game: $(el).next().text(),
            runner: $(el).next().next().text(),
            estimate: $(el).parent().next().find(".text-right").text().trim(),
            date: $(el).text() !== '' ? new Date($(el).text()) : undefined,
        })).get();
        response.send(allRuns);
    }
    catch (err) {
        console.error(err);
        response.send(err);
    }
}));
exports.status = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        const data = yield node_fetch_1.default("https://gamesdonequick.com/schedule");
        const html = yield data.text();
        const $ = cheerio.load(html);
        const now = new Date();
        const now_utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        const allRuns = $(".start-time")
            .filter((i, el) => new Date($(el).text()) > now)
            .map((i, el) => ({
            game: $(el).next().text(),
            runner: $(el).next().next().text(),
            estimate: $(el).parent().next().find(".text-right").text().trim(),
            date: $(el).text() !== '' ? new Date($(el).text()) : undefined,
        })).get();
        const currentRun = allRuns[0];
        const nextRun = allRuns[1];
        response.send({
            current: currentRun,
            next: nextRun,
        });
    }
    catch (err) {
        console.error(err);
        response.send(err);
    }
}));
//# sourceMappingURL=index.js.map