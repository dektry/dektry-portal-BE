import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Readable } from 'typeorm/platform/PlatformTools';
import { createReadStream } from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

import {
  failedToLaunchBrowser,
  templateNotFound,
} from 'cv-generation/constants/messages';

@Injectable()
export class CVGenerationService {
  async getTemplate(name: string) {
    try {
      const templatePath = path.join(
        process.cwd(),
        'src',
        'cv-generation',
        'templates',
        `${name}.html`,
      );
      return await createReadStream(templatePath, 'utf8');
    } catch (error) {
      Logger.error(error);

      throw new HttpException(templateNotFound, HttpStatus.NOT_FOUND);
    }
  }

  async generatePdf(template: string) {
    let browser;

    try {
      browser = await puppeteer.launch({
        // required for heroku
        args: ['--no-sandbox'],
        // might be useful for debugging
        // headless: false,
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        failedToLaunchBrowser,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const page = await browser.newPage();
    // the width and height are the same as the width and height of the pdf document
    await page.setViewport({ width: 794, height: 1123 });

    // somebody will try to inject script (I tried)
    await page.setJavaScriptEnabled(false);

    const normalizer = `
      <style>
        body {
          margin: 0;
        }
      </style>
        `;
    await page.setContent(normalizer + template);

    const pdfPxWidth = 794;
    // pdfPxWidth is always the same but temple width can be adjusted
    const templateWidth = 595;

    // await new Promise((resolve) => setTimeout(resolve, 250000));

    const pdf = await page.pdf({
      // enable this to prevent empty page in the end of the pdf
      // pageRanges: '1-3',
      scale: pdfPxWidth / templateWidth,
      printBackground: true,
      width: 794,
      height: 1123,
      timeout: 10000,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    await browser.close();

    return Readable.from(pdf);
  }
}
