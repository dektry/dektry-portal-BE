import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    } catch (err) {
      console.log('Could not load html template');
      throw new HttpException(templateNotFound, HttpStatus.NOT_FOUND);
    }
  }

  async generatePdf(template: string) {
    console.log(template);
    if (!template) {
      throw new HttpException(noTemplate, HttpStatus.BAD_REQUEST);
      return;
    }

    const browser = await puppeteer.launch({
      // might be useful for debugging
      // headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 595, height: 842 });

    await page.setContent(template);

    const pdf = await page.pdf();

    await browser.close();

    return pdf;
  }
}
