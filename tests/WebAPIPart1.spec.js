import { expect, test, request } from '@playwright/test';
import { APIUtils } from './utils/APIUtils.js';

const loginPayload = {userEmail: "joserobertoq@outlook.com", userPassword: "2Hidroxil@"}
const orderPayload = {orders: [{country: "India", productOrderedId: "68a961459320a140fe1ca57a"}]}
let response;

test.beforeAll( async() => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});


test('Place the order', async ({ page }) => {
    page.addInitScript((value) => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");

    await page.locator("button[routerlink*='myorders']").click();

    await page.locator("tbody").waitFor();

    const rows = page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (response.orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetailsPage = await page.locator(".col-text").textContent();

    await page.pause();

    expect(response.orderId.includes(orderIdDetailsPage)).toBeTruthy();
});