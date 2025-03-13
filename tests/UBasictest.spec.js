import { test } from '@playwright/test';

test('First Playwright test', async ({ page }) => {
    //const context = await browser.newContext();
    //const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
});