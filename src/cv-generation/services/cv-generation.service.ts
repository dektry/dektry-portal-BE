import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

@Injectable()
export class CVGenerationService {
  async getTemplate(name: string) {
    let template: string | null = null;
    try {
      const templatePath = path.resolve(
        `./src/cv-generation/templates/${name}.html`,
      );
      template = await readFile(templatePath, 'utf8');
    } catch (err) {
      console.log('Could not load html template');
    }

    return template;
  }
}
