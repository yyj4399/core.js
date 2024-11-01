// log
import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

// sdk
import Crawler from "crawler";

const url_1 = "https://www.zhipin.com/web/geek/job?city=101190900&position=100103,100114";
const url_2 = "https://www.zhipin.com/wapi/zpgeek/search/joblist.json?scene=1&query=&city=101190900&experience=&payType=&partTime=&degree=&industry=&scale=&stage=&position=100103,100114&jobType=&salary=&multiBusinessDistrict=&multiSubway=&page=1&pageSize=30";
const url = "https://www.cool18.com/bbs4/index.php?app=forum&act=threadview&tid=14122637";

const c = new Crawler({
  rateLimit: 1000,
  maxConnections: 10,
  userAgents: [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  ],
  // This will be called for each crawled page
  callback: (error, res, done) => {
    logger.trace(res);
    if (error) {
      console.log(error);
    } else {
      const $ = res.$;
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      console.log($("title").text());
    }
    done();
  },
});

// Add just one URL to queue, with default callback
// c.add(url_1);
// c.add(url_2);

export const func_crawler = {
  // 启动
  start: async () => {
    // 
  }
};
