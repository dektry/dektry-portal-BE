import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Readable } from 'typeorm/platform/PlatformTools';
import { createReadStream } from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

import { templateNotFound } from 'cv-generation/constants/messages';

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
    const browser = await puppeteer.launch({
      // might be useful for debugging
      // headless: false,
    });

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
      scale: pdfPxWidth / templateWidth,
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
