const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const templates = require("./templates");

const log = console.log;

function installDependencies() {
  try {
    log("\x1b[34m", "Initializing git", "\x1b[0m");
    execSync("git init");

    log("\x1b[33m", "Installing dependencies...", "\x1b[0m");
    execSync("npm install");

    log(
      "\x1b[32m",
      "The installation is done, this is ready to use !",
      "\x1b[0m"
    );

    log();
    log(`    cd ${folderName}`);
    log("    npm run dev", "\x1b[0m");
    log("\x1b[32m", "Happy Hacking Whoopie!!!!", "\x1b[0m");
  } catch (error) {
    log(error);
  }
}

function noInstallation(folderName) {
  log("\x1b[34m", "Initializing git", "\x1b[0m");
  execSync("git init");
  log();
  log("\x1b[32m", "Project setup complete...!!!!!", "\x1b[0m");
  log(`    cd ${folderName}`);
  log("    npm install && npm run dev", "\x1b[0m");
  log();
  log("\x1b[32m", "Happy Hacking Whoopie!!!!", "\x1b[0m");
}

function unlinkBaseFiles(appPath) {
  execSync("npx rimraf ./.git");
  fs.unlinkSync(path.join(appPath, "README.md"));
  fs.unlinkSync(path.join(appPath, "package.json"));
  fs.unlinkSync(path.join(appPath, "package-lock.json"));
  fs.unlinkSync(path.join(appPath, ".gitignore"));
  fs.unlinkSync(path.join(appPath, "LICENSE"));
  fs.unlinkSync(path.join(appPath, "index.js"));
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
  installDependencies,
  unlinkBaseFiles,
  checkOptions,
  noInstallation,
};
