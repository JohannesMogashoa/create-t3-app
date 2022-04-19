const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const templates = require("./templates");

async function runCmd(command) {
  try {
    log(`Running command: ${command}`);
    const { stdout, stderr } = await exec(command);
    log(stdout);
    log(stderr);
  } catch {
    (error) => {
      log("\x1b[31m", error, "\x1b[0m");
    };
  }
}

async function installDependencies(folderName) {
  try {
    log("\x1b[33m", "Installing dependencies...", "\x1b[0m");
    await runCmd("npm install");

    log(
      "\x1b[32m",
      "The installation is done, this is ready to use !",
      "\x1b[0m"
    );

    log();

    log("\x1b[34m", "You can start by typing:");
    log(`    cd ${folderName}`);
    log("    npm run dev", "\x1b[0m");
    log();
    log("Check Readme.md for more informations");
    log();
  } catch (error) {
    log(error);
  }
}

function noInstallation() {
  log("\x1b[34m", "You can start by typing:");
  log(`    cd ${folderName}`);
  log("    npm install", "\x1b[0m");
  log("    npm run dev", "\x1b[0m");
  log();
  log("Check Readme.md for more informations");
  log();
}

function unlinkBaseFiles() {
  fs.unlinkSync(path.join(appPath, "README.md"));
  fs.unlinkSync(path.join(appPath, "package.json"));
  fs.unlinkSync(path.join(appPath, "yarn.lock"));
  fs.unlinkSync(path.join(appPath, ".gitignore"));
  fs.unlinkSync(path.join(appPath, "LICENSE"));
}

function checkOptions(options) {
  const { auth, trpc, prisma } = options;
  let chosenTemplate;

  // Check program options
  if (prisma && !trpc && !auth) {
    chosenTemplate = templates.find(
      (template) => template.name === "with-prisma"
    );
  } else if (auth && prisma && !trpc) {
    chosenTemplate = templates.find(
      (template) => template.name === "with-prisma-auth"
    );
  } else if (trpc && prisma && !auth) {
    chosenTemplate = templates.find(
      (template) => template.name === "with-prisma-trpc"
    );
  } else if (trpc && prisma && auth) {
    chosenTemplate = templates.find(
      (template) => template.name === "with-prisma-trpc-auth"
    );
  } else {
    chosenTemplate = templates.find((template) => template.name === "basic");
  }

  return chosenTemplate;
}

module.exports = {
  runCmd,
  installDependencies,
  unlinkBaseFiles,
  checkOptions,
  noInstallation,
};
