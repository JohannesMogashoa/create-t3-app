#! /usr/bin/env node
"use strict";

// Import Dependencies
const fs = require("fs");
const path = require("path");
const program = require("commander");
const readline = require("readline");
const {
  runCmd,
  installDependencies,
  unlinkBaseFiles,
  checkOptions,
  noInstallation,
} = require("./bin/helpers");

// Define Variables
const log = console.log;
let chosenTemplate = "basic";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Define Program Details
program
  .name("create-t3-app")
  .description(
    "CLI to create a new nextjs app using the T3 stack inspired by https://init.tips"
  )
  .version("0.8.0");

// Define Program Options
program
  .option("-n, --name <name>", "Name of the new app")
  .option("-a, --auth", "include authentication using NextAuth")
  .option("-tr, --trpc", "include trpc")
  .option("-p, --prisma", "include prisma")
  .parse();

// Extract Program Options
const { name, auth, trpc, prisma } = program.opts();

if (auth && !prisma) {
  log("You need to include Prisma as well if you want to use Auth");
  process.exit(1);
}

const ownPath = process.cwd();
const folderName = name || "my-app";
const appPath = path.join(ownPath, folderName);
const repo = "https://github.com/JohannesMogashoa/create-t3-app.git";

try {
  fs.mkdirSync(appPath);
} catch (error) {
  if (err.code === "EEXIST") {
    log(
      "\x1b[31m",
      `The file ${name} already exist in the current directory, please give it another name.`,
      "\x1b[0m"
    );
  } else {
    log(err);
  }
  process.exit(1);
}

chosenTemplate = checkOptions(program.opts());

async function setup() {
  try {
    log("\x1b[33m", "Downloading the project structure...", "\x1b[0m");
    await runCmd(`git clone --depth 1 ${repo} ${folderName}`);

    process.chdir(appPath);
    log("\x1b[33m", "Setting Up project structure...", "\x1b[0m");

    await runCmd("npx rimraf ./.git");

    if (fs.readdirSync(appPath).length > 6) {
      unlinkBaseFiles(appPath);

      fs.cpSync(path.join(appPath, `bin/templates/${chosenTemplate}`), appPath);
      fs.rmdirSync(path.join(appPath, "bin"), { recursive: true });

      const answer = rl.question(
        "\x1b[33m",
        "Do you want to install dependencies? (y/n)"
      );

      log();

      if (answer === "y") {
        await installDependencies(folderName);
      } else {
        noInstallation();
      }
    }
  } catch (error) {
    log(error);
  }
}

setup();
