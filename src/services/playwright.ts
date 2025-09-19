'use server';

import { chromium, devices } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

class PlaywrightService {
  private static instance: PlaywrightService | null = null;
  private browser: any;
  private context: any;
  public page: any; // Make page public to simplify access
  private device: string | undefined;
  private videoPath: string | null = null;

  private constructor(device?: string) {
    this.device = device;
  }

  public static async getInstance(device?: string): Promise<PlaywrightService> {
    // If an instance exists and the device is different, close the old one.
    if (PlaywrightService.instance && PlaywrightService.instance.device !== device) {
        await PlaywrightService.instance.closeAndGetVideo();
        PlaywrightService.instance = null;
    }

    if (!PlaywrightService.instance) {
      const newInstance = new PlaywrightService(device);
      await newInstance.initialize(); // Await initialization here.
      PlaywrightService.instance = newInstance;
    }
    return PlaywrightService.instance;
  }

  private async initialize() {
    this.browser = await chromium.launch({ headless: true });
    
    // Ensure the videos directory exists
    const videosDir = path.join(process.cwd(), 'videos');
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    const contextOptions: any = {
      recordVideo: {
        dir: videosDir,
        size: { width: 1280, height: 720 }
      }
    };

    if (this.device && devices[this.device]) {
      this.context = await this.browser.newContext({ ...devices[this.device], ...contextOptions });
    } else {
      this.context = await this.browser.newContext(contextOptions);
    }
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

  async getPagePerformanceMetrics(): Promise<any> {
    const performanceTiming = await this.page.evaluate(() => JSON.stringify(window.performance.timing));
    const parsed = JSON.parse(performanceTiming);
    const loadTime = parsed.loadEventEnd - parsed.navigationStart;
    const domComplete = parsed.domComplete - parsed.domInteractive;
    return {
      loadTime: `${loadTime}ms`,
      domCompleteTime: `${domComplete}ms`,
    }
  }

  async closeAndGetVideo(): Promise<string | null> {
    if (this.page) {
       this.videoPath = await this.page.video()?.path() || null;
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
    
    let videoDataUri: string | null = null;
    if (this.videoPath && fs.existsSync(this.videoPath)) {
        const videoBuffer = fs.readFileSync(this.videoPath);
        videoDataUri = `data:video/webm;base64,${videoBuffer.toString('base64')}`;
        fs.unlinkSync(this.videoPath); // Clean up the video file
    }
    
    PlaywrightService.instance = null;
    return videoDataUri;
  }
}

export { PlaywrightService };
