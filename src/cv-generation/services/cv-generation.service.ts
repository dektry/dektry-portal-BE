import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Readable } from 'typeorm/platform/PlatformTools';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import puppeteer from 'puppeteer';

import { noTemplate, templateNotFound } from '../constants/messages';

const readFile = promisify(fs.readFile);

@Injectable()
export class CVGenerationService {
  async getTemplate(name: string) {
    try {
      const templatePath = path.resolve(
        `./src/cv-generation/templates/${name}.html`,
      );
      return await readFile(templatePath, 'utf8');
    } catch (error) {
      Logger.error(error);

      throw new HttpException(templateNotFound, HttpStatus.NOT_FOUND);
    }
  }

  async generatePdf(template: string) {
    if (!template) {
      throw new HttpException(noTemplate, HttpStatus.BAD_REQUEST);
    }

    try {
      const browser = await puppeteer.launch({
        // might be useful for debugging
        // headless: false,
      });
      const page = await browser.newPage();
      // the width and height are the same as the width and height in the template
      await page.setViewport({ width: 595, height: 842 });

      await page.setContent(template);

      const pdf = await page.pdf();

      await browser.close();

      return Readable.from(pdf);
    } catch (error) {
      Logger.error(error);

      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
