import * as functions from 'firebase-functions';
import * as cheerio from "cheerio";
import fetch from "node-fetch";

interface IRun {
  game?: string;
  runner?: string;
  estimate?: string;
  date?: Date;
}

export const schedule = functions.https.onRequest(async (request, response) => {
  try {
    const data = await fetch("https://gamesdonequick.com/schedule");

    const html = await data.text();
    const $ = cheerio.load(html);

    const now = new Date();
    const now_utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

    const allRuns = $(".start-time")
      .map((i, el) => ({
        game: $(el).next().text(),
        runner: $(el).next().next().text(),
        estimate: $(el).parent().next().find(".text-right").text().trim(),
        date: $(el).text() !== '' ? new Date($(el).text()) : undefined,
      })).get() as IRun[];

    response.send(allRuns);
  } catch (err) {
    console.error(err);
    response.send(err);
  }
})

export const status = functions.https.onRequest(async (request, response) => {
  try {
    const data = await fetch("https://gamesdonequick.com/schedule");

    const html = await data.text();
    const $ = cheerio.load(html);

    const now = new Date();
    const now_utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

    const allRuns = $(".start-time")
      .filter((i, el) => new Date($(el).text()) > now)
      .map((i, el) => ({
        game: $(el).next().text(),
        runner: $(el).next().next().text(),
        estimate: $(el).parent().next().find(".text-right").text().trim(),
        date: $(el).text() !== '' ? new Date($(el).text()) : undefined,
      })).get() as IRun[];

    const currentRun = allRuns[0];
    const nextRun = allRuns[1];

    response.send({
      current: currentRun,
      next: nextRun,
    });
  } catch (err) {
    console.error(err);
    response.send(err);
  }
});
