import { expect, test } from '@playwright/test';
import { sign } from 'crypto';

test.only('First Playwright test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    // selectors
    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const signInButton = page.locator('#signInBtn');
    const cardTitles = page.locator('.card-body a');

    // css, xpath selector
    await userName.fill('rahulshetty');
    await password.fill('learning');
    await signInButton.click();

    console.log(await page.locator("[style*='block']").textContent());

    await userName.fill('');
    await userName.fill('rahulshettyacademy');
    await signInButton.click();

    console.log(await cardTitles.nth(0).textContent());

    const cardTitlesText = await cardTitles.allTextContents();
    console.log(cardTitlesText);
});

test('Page Playwright test', async ({ page }) => {
    await page.goto("https://google.com");
    console.log(await page.title());

    await expect(page).toHaveTitle(/Google/);
});