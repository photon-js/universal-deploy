/** biome-ignore-all lint/suspicious/noExplicitAny: tests */
import fs from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { goto } from "./utils.js";

test.describe("Server-side HMR", () => {
  test.skip(!process.env.HMR, "disabled HMR tests");
  const apiFilePath = path.join(process.cwd(), "src/api/test.ts");
  const viteConfigPath = path.join(process.cwd(), "vite.config.ts");

  let originalApiContent: string;
  let originalViteConfig: string;

  test.beforeAll(async () => {
    // Backup original files
    originalApiContent = await fs.readFile(apiFilePath, "utf-8");
    originalViteConfig = await fs.readFile(viteConfigPath, "utf-8");
  });

  test.afterAll(async () => {
    // Restore original files
    await fs.writeFile(apiFilePath, originalApiContent, "utf-8");
    await fs.writeFile(viteConfigPath, originalViteConfig, "utf-8");
  });

  test("should hot reload API endpoint changes", async ({ page }) => {
    // Make initial API call and verify response
    const initialResponse = await goto(page, "/api/test");
    const initialData = await initialResponse?.text();

    expect(initialData).toBe("test");

    // Modify the API file
    const modifiedApiContent = originalApiContent.replace('"test"', '"test-HMR"');
    await fs.writeFile(apiFilePath, modifiedApiContent, "utf-8");

    // Wait for HMR to process the change
    await page.waitForTimeout(2000);

    // Make API call again and verify the change was applied
    const updatedResponse = await page.reload();
    const updatedData = await updatedResponse?.text();

    expect(updatedData).toBe("test-HMR");
  });

  test("should hot reload vite.config.ts changes", async ({ page }) => {
    await goto(page, "/");

    const addedCode = '\nconsole.log("test");';
    const reloadPromise = page.waitForEvent("load");
    await fs.appendFile(viteConfigPath, addedCode, "utf-8");

    await expect(reloadPromise).resolves.toBeDefined();
  });
});
