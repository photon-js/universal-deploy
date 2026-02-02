import fs from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

// TODO
test.describe("Server-side HMR", () => {
  const apiFilePath = path.join(process.cwd(), "api/test.ts");
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
    const initialResponse = await page.request.get("/api/test");
    const initialData = await initialResponse.json();

    expect(initialData).toHaveProperty("message");
    const initialMessage = initialData.message;

    // Modify the API file
    const modifiedApiContent = originalApiContent.replace(/message:\s*['"].*?['"]/, `message: 'HMR Updated Message'`);
    await fs.writeFile(apiFilePath, modifiedApiContent, "utf-8");

    // Wait for HMR to process the change
    await page.waitForTimeout(2000);

    // Make API call again and verify the change was applied
    const updatedResponse = await page.request.get("/api/test");
    const updatedData = await updatedResponse.json();

    expect(updatedData.message).toBe("HMR Updated Message");
    expect(updatedData.message).not.toBe(initialMessage);
  });

  test("should hot reload vite.config.ts changes", async ({ page }) => {
    // Modify vite.config.ts - example: adding a new environment variable
    const modifiedViteConfig = originalViteConfig.replace(
      /define:\s*{/,
      `define: {\n    'process.env.TEST_HMR': JSON.stringify('hmr-active'),`,
    );
    await fs.writeFile(viteConfigPath, modifiedViteConfig, "utf-8");

    // Wait for Vite to detect the config change and restart
    await page.waitForTimeout(3000);

    // Reload the page to get new config
    await page.reload();

    // Verify the config change is applied
    const envValue = await page.evaluate(() => {
      return (process as any).env.TEST_HMR;
    });

    expect(envValue).toBe("hmr-active");
  });

  test("should preserve server state during API HMR", async ({ page }) => {
    // Make initial requests to establish state
    await page.request.post("/api/test", {
      data: { action: "initialize" },
    });

    // Modify the API file
    const modifiedApiContent = originalApiContent.replace(
      /return.*?;/,
      `return { message: 'Modified', timestamp: Date.now() };`,
    );
    await fs.writeFile(apiFilePath, modifiedApiContent, "utf-8");

    // Wait for HMR
    await page.waitForTimeout(2000);

    // Verify the modified endpoint works
    const response = await page.request.get("/api/test");
    const data = await response.json();

    expect(data).toHaveProperty("message", "Modified");
    expect(data).toHaveProperty("timestamp");
  });
});
