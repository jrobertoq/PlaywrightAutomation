import { expect, test } from '@playwright/test';

test('First Playwright test', async ({ browser }) => {
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

test('UI Controls', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const signInButton = page.locator('#signInBtn');
    const dropdown = page.locator('select.form-control');
    const userRadioBtn = page.locator('.radiotextsty');
    const termsCheckbox = page.locator('#terms');
    const documentsLink = page.locator("[href*='documents-request']")
    
    await dropdown.selectOption('consult');

    await userRadioBtn.last().click();
    await page.locator('#okayBtn').click();

    await expect(userRadioBtn.last()).toBeChecked();
    console.log(await userRadioBtn.last().isChecked());

    await termsCheckbox.click();
    await expect(termsCheckbox).toBeChecked();
    await termsCheckbox.uncheck();

    await expect((termsCheckbox)).not.toBeChecked();
    expect(await termsCheckbox.isChecked()).toBeFalsy();

    await expect(documentsLink).toHaveAttribute('class', 'blinkingText');
});

test('Child windows', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    const documentsLink = page.locator("[href*='documents-request']")

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        documentsLink.click()
    ])

    const text = await newPage.locator('.red').textContent();

    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);

    await userName.fill(domain);

    console.log(await userName.textContent());
});