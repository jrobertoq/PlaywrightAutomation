import { expect, test } from '@playwright/test';
let webContext;

test.beforeAll( async({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const userEmail= "joserobertoq@outlook.com"
    await page.locator('#userEmail').fill(userEmail);
    await page.locator('#userPassword').fill('2Hidroxil@');
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    await context.storageState({ path: 'state.json' });
    webContext = await browser.newContext({ storageState: 'state.json' });
})


test('Client App Login', async () => {
    const productName = "ZARA COAT 3";
    const page = await webContext.newPage();
    const userEmail= "joserobertoq@outlook.com"
    const products = page.locator('.card-body');
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('.card-body b').first().waitFor();

    const titles = await page.locator('.card-body b').allTextContents();

    const count = await products.count();
    
    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            //add to cart
            await products.nth(i).locator("text= Add to cart").click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();

    await page.locator("div li").first().click();

    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();

    expect(bool).toBeTruthy();

    await page.locator("text=Checkout").click();

    await page.locator("[placeholder*='Country']").pressSequentially('Ind');  

    const dropdown = page.locator(".ta-results")

    await dropdown.first().waitFor();

    const optionsCount = await dropdown.locator("button").count();

    for (let i = 0; i < optionsCount; i++) {
        const text = await dropdown.locator("button").nth(i).textContent();

        if (text === " India") {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    await expect(page.locator(".user__name label[type='text']")).toHaveText(userEmail);

    await page.locator(".action__submit").click();

    await expect(page.locator(".hero-primary")).toHaveText("Thankyou for the order.");

    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();

    await page.locator("button[routerlink*='myorders']").click();

    await page.locator("tbody").waitFor();

    const rows = page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetailsPage = await page.locator(".col-text").textContent();

    expect(orderId.includes(orderIdDetailsPage)).toBeTruthy();
});
