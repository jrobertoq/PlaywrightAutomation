import { expect, test, request } from '@playwright/test';

const loginPayload = {userEmail: "joserobertoq@outlook.com", userPassword: "2Hidroxil@"}
let token;

test.beforeAll( async() => {
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
        {
            data: loginPayload
        })
    
    expect(loginResponse.ok()).toBeTruthy();

    const responseBody = await loginResponse.json();
    console.log(responseBody);
    token = responseBody.token;
    console.log(token);
});


test('Client App Login', async ({ page }) => {
    page.addInitScript((value) => {
        window.localStorage.setItem('token', value);
    }, token);

    const productName = "ZARA COAT 3";
    const userEmail= "joserobertoq@outlook.com"

    await page.goto("https://rahulshettyacademy.com/client");
        
    const products = page.locator('.card-body');

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