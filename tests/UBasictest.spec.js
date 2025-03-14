import { test } from '@playwright/test';

test('First Playwright test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
});

test('Page Playwright test', async ({ page }) => {
    await page.goto("https://google.com");
});