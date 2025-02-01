import puppeteer from 'puppeteer';
import {compact} from "es-toolkit";

export async function getImagesForText(text: string): Promise<string[]> {
    console.log('Searching images for:', text);
    const searchTerm = encodeURIComponent(text);
    const url = `https://www.bing.com/images/search?q=${searchTerm}&form=QBILPG`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    // Ensure images are loaded
    await page.waitForSelector('img.mimg');

    // Extract image URLs
    const imageUrls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img.mimg'))
            .map(img => (img as HTMLImageElement).src)
            .filter(src => src.startsWith('http'));
    });

    await browser.close();
    console.log('Searching images for:', text, ' done');
    return compact(imageUrls.slice(3)); // Skip promotional images
}
