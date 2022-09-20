import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Readable } from 'typeorm/platform/PlatformTools';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import puppeteer from 'puppeteer';

import { templateNotFound } from '../constants/messages';

const readFile = promisify(fs.readFile);

@Injectable()
export class CVGenerationService {
  async getTemplate(name: string) {
    try {
      const templatePath = path.join(
        process.cwd(),
        `./src/cv-generation/templates/${name}.html`,
      );
      return await readFile(templatePath, 'utf8');
    } catch (error) {
      Logger.error(error);

      throw new HttpException(templateNotFound, HttpStatus.NOT_FOUND);
    }
  }

  async generatePdf(template: string) {
    const browser = await puppeteer.launch({
      // might be useful for debugging
      // headless: false,
    });
    const page = await browser.newPage();
    // the width and height are the same as the width and height in the template
    await page.setViewport({ width: 595, height: 842 });

    // somebody will try to inject script (I tried)
    await page.setJavaScriptEnabled(false);

    await page.setContent(template);

    const pdf = await page.pdf({ timeout: 10000 });

    await browser.close();

    return Readable.from(pdf);
  }
}
