import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { templateNotFound } from '../constants/messages';

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
}
