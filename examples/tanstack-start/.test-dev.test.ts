import { testRun } from "./testRun.js";

testRun("pnpm run dev --strictPort --port 3000", {
  // pnpm run dev tends to exit with code 143 for some reason
  tolerateExitCode: [143],
  tolerateError({ logText, logSource }) {
    if (logSource === "run() failure" && logText.includes("error code 143")) return true;
  },
});
