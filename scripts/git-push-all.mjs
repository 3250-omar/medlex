import { execSync } from "child_process";

// ANSI colors for clean console output
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const blue = (text) => `\x1b[34m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const bold = (text) => `\x1b[1m${text}\x1b[0m`;

function run(cmd, desc) {
  if (desc) console.log(`${blue("→")} ${desc}...`);
  try {
    return execSync(cmd, { stdio: "pipe", encoding: "utf8" }).trim();
  } catch (error) {
    const stderr = error.stderr?.trim() || error.message;
    console.error(red(`✖ Command failed: ${cmd}`));
    console.error(red(stderr));
    process.exit(1);
  }
}

function main() {
  console.log(bold("\n🚀 MedLex Git Dual-Branch Push (main & dev)\n"));

  // 1. Get commit message
  const args = process.argv.slice(2);
  let commitMessage = args.join(" ").trim();

  if (!commitMessage) {
    const now = new Date().toLocaleString("en-GB", { timeZone: "Africa/Cairo" });
    commitMessage = `chore: update codebase (${now})`;
    console.log(yellow(`⚠ No commit message provided. Using default: "${commitMessage}"`));
    console.log(yellow(`💡 Tip: You can pass a custom message like: npm run push "your message"\n`));
  }

  // 2. Determine current branch
  const currentBranch = run("git rev-parse --abbrev-ref HEAD", "Detecting current branch");
  console.log(`${green("✔")} Active branch: ${bold(currentBranch)}`);

  if (!["main", "dev"].includes(currentBranch)) {
    console.error(red(`✖ Current branch '${currentBranch}' is neither 'main' nor 'dev'. Aborting.`));
    process.exit(1);
  }

  const targetBranch = currentBranch === "main" ? "dev" : "main";

  // 3. Stage changes
  console.log(`${blue("→")} Staging changes (git add -A)...`);
  run("git add -A");

  // 4. Commit if there are changes
  const status = run("git status --porcelain");
  if (status) {
    console.log(`${blue("→")} Committing: "${commitMessage}"...`);
    run(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
    console.log(`${green("✔")} Changes committed successfully.`);
  } else {
    console.log(yellow("ℹ No new uncommitted changes detected. Proceeding to push existing commits."));
  }

  // 5. Push active branch to origin
  console.log(`${blue("→")} Pushing to origin/${currentBranch}...`);
  run(`git push origin ${currentBranch}`);
  console.log(`${green("✔")} Pushed to ${bold(`origin/${currentBranch}`)}`);

  // 6. Push active branch to origin target branch
  console.log(`${blue("→")} Synchronizing and pushing to origin/${targetBranch}...`);
  run(`git push origin ${currentBranch}:${targetBranch}`);
  console.log(`${green("✔")} Pushed to ${bold(`origin/${targetBranch}`)}`);

  // 7. Update local target branch pointer so both local branches remain synchronized
  try {
    run(`git branch -f ${targetBranch} ${currentBranch}`);
    console.log(`${green("✔")} Updated local ${bold(targetBranch)} pointer to match ${bold(currentBranch)}.`);
  } catch {
    // Non-fatal if local branch update needs manual checkout
  }

  console.log(bold(green("\n✨ All done! Both 'main' and 'dev' branches are fully up-to-date on GitHub.\n")));
}

main();
