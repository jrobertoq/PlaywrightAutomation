import { expect, test, request } from '@playwright/test';
import { APIUtils } from './utils/APIUtils.js';

const loginPayload = {userEmail: "joserobertoq@outlook.com", userPassword: "2Hidroxil@"}
const orderPayload = {orders: [{country: "India", productOrderedId: "6960eac0c941646b7a8b3e68"}]}
const fakePayLoadOrders = {data: [], message: "No Orders"}
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

    page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/62cfe5e2e26b7e1a10f1b57d", 
        route=>
        {
            const response = page.request.fetch(route.request());
            let body = JSON.stringify(fakePayLoadOrders);
            route.fulfill({
                response,
                body
            });
            //intercepting the response - API response -> playwright fakeResponse -> browser -> render data on front-end
        })

    await page.pause();

    await page.locator("button[routerlink*='myorders']").click();

    await page.locator("tbody").waitFor();

    const rows = page.locator("tbody tr");

});