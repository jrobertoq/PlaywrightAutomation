import { expect, test, request } from '@playwright/test';

const loginPayload = {userEmail: "joserobertoq@outlook.com", userPassword: "2Hidroxil@"}
const orderPayload = {orders: [{country: "India", productOrderedId: "67a8dde5c0d3e6622a297cc8"}]}
let token;
let orderId;

test.beforeAll( async() => {
    // Login API
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
        {
            data: loginPayload
        })
    
    expect(loginResponse.ok()).toBeTruthy();

    const responseBody = await loginResponse.json();
    token = responseBody.token;
    console.log(token);

    // Creare an order
    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayload,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }
    );

    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    orderId = orderResponseJson.orders[0];
    console.log(orderId);
});


test('Client App Login', async ({ page }) => {
    page.addInitScript((value) => {
        window.localStorage.setItem('token', value);
    }, token);

    await page.goto("https://rahulshettyacademy.com/client");

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

    await page.pause();

    expect(orderId.includes(orderIdDetailsPage)).toBeTruthy();
});