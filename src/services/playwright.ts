'use server';

import { chromium } from 'playwright';

class PlaywrightService {
  private static instance: PlaywrightService;
  private browser: any;
  private context: any;
  private page: any;

  private constructor() {}

  public static async getInstance(): Promise<PlaywrightService> {
    if (!PlaywrightService.instance) {
      PlaywrightService.instance = new PlaywrightService();
      await PlaywrightService.instance.initialize();
    }
    return PlaywrightService.instance;
  }

  private async initialize() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async goTo(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async screenshot(path: string): Promise<string> {
    const buffer = await this.page.screenshot({ path });
    return buffer.toString('base64');
  }

  async getPageContent(): Promise<string> {
    return this.page.content();
  }

  async click(selector: string) {
    await this.page.click(selector, { force: true });
  }

  async fill(selector: string, value: string) {
    await this.page.fill(selector, value);
  }
  
  async getPageAsDataUri(): Promise<string> {
    const buffer = await this.page.screenshot();
    return `data:image/png;base64,${buffer.toString('base64')}`;
  }

  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async scroll(direction: 'up' | 'down') {
    if (direction === 'down') {
      await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
    } else {
      await this.page.evaluate(() => window.scrollBy(0, -window.innerHeight));
    }
  }

  async pressKey(key: string, selector?: string) {
    if (selector) {
      await this.page.press(selector, key);
    } else {
      await this.page.keyboard.press(key);
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
    PlaywrightService.instance = null!;
  }
}

export const playwrightService = await PlaywrightService.getInstance();
