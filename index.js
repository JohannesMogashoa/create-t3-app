#! /usr/bin/env node
"use strict";

// Import Dependencies
const fs = require("fs");
const path = require("path");
// const chalk = require("chalk");
const program = require("commander");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// Define Variables
const log = console.log;
const base_github_url = "https://github.com/JohannesMogashoa";
let chosenTemplate;

async function runCmd(command) {
  try {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  } catch {
    (error) => {
      console.log("\x1b[31m", error, "\x1b[0m");
    };
  }
}

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

const templates = [
  {
    name: "basic",
    description: "Basic Next.js Template",
    url: `${base_github_url}/nextjs-prisma`,
  },
  {
    name: "with-prisma",
    description: "Basic Next.js Template with Prisma",
    url: `${base_github_url}/tree/master/templates/with-prisma`,
  },
  {
    name: "with-prisma-auth",
    description: "Basic Next.js Template with Prisma and Auth",
    url: `${base_github_url}/tree/master/templates/with-prisma-auth`,
  },
  {
    name: "with-prisma-trpc",
    description: "Basic Next.js Template with Prisma and TRPC",
    url: `${base_github_url}/tree/master/templates/with-prisma-trpc`,
  },
  {
    name: "with-prisma-trpc-auth",
    description: "Basic Next.js Template with Prisma, TRPC and Auth",
    url: `${base_github_url}/tree/master/templates/with-prisma-trpc-auth`,
  },
];

if (auth && !prisma) {
  log("You need to include Prisma as well if you want to use Auth");
  process.exit(1);
}

// Check program options
if (prisma && !trpc && !auth) {
  chosenTemplate = templates.find(
    (template) => template.name === "with-prisma"
  );
  log(`You have chosen the ${chosenTemplate.name} template`);
} else if (auth && prisma && !trpc) {
  chosenTemplate = templates.find(
    (template) => template.name === "with-prisma-auth"
  );
  log(`You have chosen the ${chosenTemplate.name} template`);
} else if (trpc && prisma && !auth) {
  chosenTemplate = templates.find(
    (template) => template.name === "with-prisma-trpc"
  );
  log(`You have chosen the ${chosenTemplate.name} template`);
} else if (trpc && prisma && auth) {
  chosenTemplate = templates.find(
    (template) => template.name === "with-prisma-trpc-auth"
  );
  log(`You have chosen the ${chosenTemplate.name} template`);
} else {
  log("You have not chosen any options, therefore basic template will be used");

  //   log(`npx create-next-app ${name} --example ${templates[0].url}`);

  runCmd(`npx create-next-app ${name} --example ${templates[0].url}`);
}
