import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import puppeteer  from 'puppeteer';

@Injectable()
export class PdfGeneratorService {

  generateDocument() {
    const source = readFileSync(
      join(__dirname, '../templates/document.hbs'),
      {
        encoding: 'utf8'
      }
    );

    const template = Handlebars.compile(source);

    return template({ text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi dolorem in maiores minima quam qui quis quod repudiandae vitae! Aliquid animi commodi consectetur debitis doloribus earum, eos est fugiat libero maiores nam nesciunt perferendis placeat quis quos tempora velit voluptas, voluptate. Aliquid aspernatur deserunt esse fuga laboriosam qui quo velit!' })
  }

  async getDocument() {
    const contentDocument = this.generateDocument();

    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();

    await page.goto(
      `data:text/html;charset=utf-8,${ contentDocument }`,
      {
        waitUntil: 'networkidle0'
      }
    );

    const pdf = await page.pdf({
      format: 'A4'
    });

    await browser.close();

    return pdf;
  }

  getDocumentWithCover() {

  }
}