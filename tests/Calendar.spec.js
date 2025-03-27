import { expect, test } from '@playwright/test';

test('Calendar validations', async ({ page }) => 
{
    const monthNumber = 6;
    const date = "15";
    const year = "2027";

    const expectedList = [monthNumber, date, year];

    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');

    await page.locator('.react-date-picker__inputGroup').click();

    await page.locator('.react-calendar__navigation__label').click();

    await page.locator('.react-calendar__navigation__label').click();

    await page.getByText(year).click();

    await page.locator('.react-calendar__year-view__months__month').nth(monthNumber - 1).click();

    await page.locator("//abbr[text()='"+date+"']").click();

    let inputs = await page.locator("input.react-date-picker__inputGroup__input").all();

    for (let i = 0; i < inputs.length(); i++) {
        const value = inputs[i].getAttribute('value');
        expect(value).ToEqual(expectedList[i]);
        console.log(value);
    }
});