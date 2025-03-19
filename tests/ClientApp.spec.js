import { expect, test } from '@playwright/test';


test('Client App Login', async ({ page }) => {
    const productName = "ZARA COAT 3";
    const products = page.locator('.card-body');
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('#userEmail').fill('joserobertoq@outlook.com');
    await page.locator('#userPassword').fill('2Hidroxil@');
    await page.locator('[value="Login"]').click();

    //await page.waitForLoadState('networkidle');

    await page.locator('.card-body b').first().waitFor();

    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);

    const count = await products.count();
    
    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            //add to cart
            await products.nth(i).locator("text= Add to cart").click();
            break;
        }
    }

    await page.pause();
});
