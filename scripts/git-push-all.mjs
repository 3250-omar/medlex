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

  // 1. Get commit message from CLI argument
  const args = process.argv.slice(2);
  let commitMessage = args.join(" ").trim();

  if (!commitMessage) {
    const now = new Date().toLocaleString("en-GB", { timeZone: "Africa/Cairo" });
    commitMessage = `chore: update codebase (${now})`;
    console.log(yellow(`⚠ No commit message provided. Using default: "${commitMessage}"`));
    console.log(yellow(`💡 Tip: You can pass a custom message like: npm run push "your message"\n`));
  }

  // 2. Identify initial branch
  const initialBranch = run("git rev-parse --abbrev-ref HEAD", "Detecting active branch");
  console.log(`${green("✔")} Active branch: ${bold(initialBranch)}`);

  if (!["main", "dev"].includes(initialBranch)) {
    console.error(red(`✖ Current branch '${initialBranch}' is neither 'main' nor 'dev'. Aborting.`));
    process.exit(1);
  }

  const otherBranch = initialBranch === "main" ? "dev" : "main";

  // 3. Stage changes
  console.log(`${blue("→")} Staging all changes (git add -A)...`);
  run("git add -A");

  // 4. Commit if changes exist
  const status = run("git status --porcelain");
  if (status) {
    console.log(`${blue("→")} Committing changes: "${commitMessage}"...`);
    // Escape double quotes for shell safety
    const safeMsg = commitMessage.replace(/"/g, '\\"');
    run(`git commit -m "${safeMsg}"`);
    console.log(`${green("✔")} Changes committed to ${bold(initialBranch)}.`);
  } else {
    console.log(yellow(`ℹ Working tree is clean on ${initialBranch}. Proceeding to push & sync.`));
  }

  // 5. Push initial branch to origin
  console.log(`${blue("→")} Pushing ${bold(initialBranch)} to origin/${initialBranch}...`);
  run(`git push origin ${initialBranch}`);
  console.log(`${green("✔")} Successfully pushed to ${bold(`origin/${initialBranch}`)}.`);

  // 6. Switch to the other branch, pull latest, merge initial branch, and push
  console.log(`${blue("→")} Switching to ${bold(otherBranch)} branch...`);
  run(`git checkout ${otherBranch}`);

  console.log(`${blue("→")} Pulling latest changes from origin/${otherBranch}...`);
  try {
    run(`git pull origin ${otherBranch}`);
  } catch {
    console.log(yellow(`⚠ Could not pull origin/${otherBranch}, continuing...`));
  }

  console.log(`${blue("→")} Merging ${bold(initialBranch)} into ${bold(otherBranch)}...`);
  run(`git merge ${initialBranch} --no-edit`);

  console.log(`${blue("→")} Pushing ${bold(otherBranch)} to origin/${otherBranch}...`);
  run(`git push origin ${otherBranch}`);
  console.log(`${green("✔")} Successfully pushed to ${bold(`origin/${otherBranch}`)}.`);

  // 7. Return to initial branch
  console.log(`${blue("→")} Returning to ${bold(initialBranch)} branch...`);
  run(`git checkout ${initialBranch}`);
  console.log(`${green("✔")} Returned to ${bold(initialBranch)}.`);

  console.log(bold(green("\n✨ All done! Both 'main' and 'dev' are fully synchronized on GitHub and locally.\n")));
}

main();
