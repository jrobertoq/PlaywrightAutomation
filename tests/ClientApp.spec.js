import { expect, test } from '@playwright/test';


test('Page Playwright test', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('#userEmail').fill('joserobertoq@outlook.com');
    await page.locator('#userPassword').fill('2Hidroxil@');
    await page.locator('[value="Login"]').click();

    //await page.waitForLoadState('networkidle');

    await page.locator('.card-body b').first().waitFor();

    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);

});
