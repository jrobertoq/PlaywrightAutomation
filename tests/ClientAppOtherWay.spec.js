import { expect, test } from '@playwright/test';


test('Client App Login', async ({ page }) => {
    const productName = "ZARA COAT 3";
    const products = page.locator('.card-body');
    const userEmail= "joserobertoq@outlook.com"
    await page.goto("https://rahulshettyacademy.com/client");
    await page.getByPlaceholder('email@example.com').fill(userEmail);
    await page.getByPlaceholder('enter your passsword').fill('2Hidroxil@');
    await page.getByRole('button', {name: "Login"}).click();

    //await page.waitForLoadState('networkidle');

    await page.locator('.card-body b').first().waitFor();

    await page.locator('.card-body').filter({ hasText: productName}).getByRole('button', { name: "Add to Cart" }).click();

    await page.getByRole('listitem').getByRole('button', { name: "Cart" }).click();

    await page.locator("div li").first().click();

    await expect(page.getByText(productName)).toBeVisible();

    await page.getByRole('button', { name: "Checkout" }).click();

    await page.getByPlaceholder("Select Country").pressSequentially('Ind');

    await page.getByRole('button', { name: "India" }).nth(1).click();

    await page.getByText("PLACE ORDER").click();

    await expect(page.locator(".hero-primary")).toHaveText("Thankyou for the order.");
});
