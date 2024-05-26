import "dotenv/config";
import fs from "fs/promises";
import axios from "axios";
import { Telegraf } from "telegraf";
import chalk from "chalk";

// 读取 links.json 文件
const readLinks = async () => {
  console.log("Reading links from links.json...");
  const data = await fs.readFile("links.json", "utf-8");
  const links = JSON.parse(data);
  console.log(`Found ${links.length} links.`);
  return links;
};

// 检查友链是否可访问
const checkLinks = async (links) => {
  console.log(chalk.greenBright("[INFO] Start checking links..."));
  const deadLinks = [];
  const aliveLinks = [];
  for (const link of links) {
    if (link.bypass) {
      console.log(chalk.cyan(`[INFO] Bypassing ${link.url}...`));
      aliveLinks.push(link);
      continue;
    }
    try {
      console.log(chalk.cyan(`[INFO] Checking ${link.url}...`));
      const response = await axios.get(link.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; BigCake's Blog Check Bot; +https://www.lihaoyu.cn)",
        },
      });
      if (response.status < 200 || response.status >= 300) {
        console.log(chalk.yellowBright(`[WARN] Link ${link.url} is dead.`));
        link.errormsg = chalk.yellowBright(
          `[WARN] Status code: ${response.status}`
        );
        deadLinks.push(link);
      } else {
        aliveLinks.push(link);
      }
    } catch (error) {
      console.log(
        chalk.red(`[ERROR] Error checking ${link.url}: ${error.message}`)
      );
      link.errormsg = error.message;
      deadLinks.push(link);
    }
  }
  // 删除无效链接
  const updatedLinks = links.filter((link) => !deadLinks.includes(link));
  await fs.writeFile("links.json", JSON.stringify(updatedLinks, null, 2));
  console.log(chalk.cyan(`[INFO] Found ${deadLinks.length} dead links.`));
  return { deadLinks, aliveLinks };
};

// 检查 links-dead.json 中的链接是否恢复访问
const checkDeadLinks = async () => {
  try {
    console.log(chalk.greenBright("[INFO] Start checking dead links..."));
    const deadLinksData = await fs.readFile("links-dead.json", "utf-8");
    const deadLinks = JSON.parse(deadLinksData);
    const aliveLinks = [];

    for (const link of deadLinks) {
      if (link.bypass) {
        console.log(chalk.cyan(`[INFO] Bypassing ${link.url}...`));
        aliveLinks.push(link);
        continue;
      }
      try {
        const response = await axios.get(link.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; BigCake's Blog Check Bot; +https://www.lihaoyu.cn)",
          },
        });
        if (response.status === 200) {
          console.log(chalk.greenBright(`[INFO] Link ${link.url} is alive.`));
          delete link.errormsg; // 删除 errormsg 字段
          aliveLinks.push(link);
        }
      } catch (error) {
        // 链接仍然无法访问，不做处理
      }
    }

    // 将恢复的链接从 links-dead.json 中删除
    const updatedDeadLinks = deadLinks.filter(
      (link) => !aliveLinks.includes(link)
    );
    await fs.writeFile(
      "links-dead.json",
      JSON.stringify(updatedDeadLinks, null, 2)
    );

    return aliveLinks;
  } catch (error) {
    console.error(
      chalk.red("[ERROR] An error occurred while checking dead links:", error)
    );
    return [];
  }
};

// 将无法访问的友链移动到 links-dead.json 文件中
const saveDeadLinks = async (newDeadLinks, aliveLinks) => {
  console.log(chalk.cyan("[INFO] Saving dead links to links-dead.json..."));

  // 读取 links-dead.json 文件
  const deadLinksData = await fs.readFile("links-dead.json", "utf-8");
  let deadLinks = JSON.parse(deadLinksData);

  // 将新的死链添加到现有死链中
  deadLinks = [...deadLinks, ...newDeadLinks];

  // 将更新后的死链写入 links-dead.json
  await fs.writeFile("links-dead.json", JSON.stringify(deadLinks, null, 2));

  // 读取 links.json 文件
  const linksData = await fs.readFile("links.json", "utf-8");
  const links = JSON.parse(linksData);

  // 将存活链接写入 links.json
  const updatedLinks = [...links, ...aliveLinks];
  await fs.writeFile("links.json", JSON.stringify(updatedLinks, null, 2));
};

// 使用 Telegram Bot 发送通知消息
const sendNotification = async (deadLinks) => {
  if (deadLinks.length === 0) {
    console.log(
      chalk.cyan("[INFO] No dead links found, no notification will be sent.")
    );
    return;
  }
  
  console.log(chalk.cyan("[INFO] Sending notification..."));
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
    telegram: { apiRoot: process.env.BOT_API },
  });
  const message = `友链巡查已完成，以下友链因无法访问已被移除：\n${deadLinks
    .map((link) => `${link.name}: ${link.url} - ${link.errormsg}`)
    .join("\n")}`;
  try {
    await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message, {
      parse_mode: "HTML",
    }); // why it didn't work????
  } catch (error) {
    console.log(
      chalk.red("[ERROR] An error occurred while sending notification:", error)
    );
  }
};

// 主函数
const main = async () => {
  try {
    // 检查 links-dead.json 中的链接是否恢复访问
    const aliveLinksFromDead = await checkDeadLinks();

    // 读取 links.json 文件
    const linksData = await fs.readFile("links.json", "utf-8");
    const links = JSON.parse(linksData);

    // 检查所有链接
    const { deadLinks, aliveLinks } = await checkLinks(links);

    // 将死链接保存到 links-dead.json
    await saveDeadLinks(deadLinks, aliveLinksFromDead);

    if (deadLinks.length > 0) {
      await sendNotification(deadLinks);
    } else {
      console.log(chalk.greenBright("[INFO] All links are alive."));
    }
  } catch (error) {
    console.error(chalk.red("[ERROR] An error occurred:", error));
  }
};

main();
