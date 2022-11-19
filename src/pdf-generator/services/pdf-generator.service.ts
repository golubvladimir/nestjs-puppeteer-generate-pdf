import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import puppeteer  from 'puppeteer';
// @ts-ignore
import * as PDFMerger from 'pdf-merger-js';

@Injectable()
export class PdfGeneratorService {

  async generatePDF(contentDocument, options) {
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

    const pdf = await page.pdf(options);

    await browser.close();

    return pdf;
  }

  getDocumentContent() {
    const source = readFileSync(
      join(__dirname, '../templates/document.hbs'),
      {
        encoding: 'utf8'
      }
    );

    const template = Handlebars.compile(source);

    return template({ text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi dolorem in maiores minima quam qui quis quod repudiandae vitae! Aliquid animi commodi consectetur debitis doloribus earum, eos est fugiat libero maiores nam nesciunt perferendis placeat quis quos tempora velit voluptas, voluptate. Aliquid aspernatur deserunt esse fuga laboriosam qui quo velit!' })
  }

  getCoverContent() {
    const source = readFileSync(
      join(__dirname, '../templates/cover.hbs'),
      {
        encoding: 'utf8'
      }
    );

    const template = Handlebars.compile(source);

    return template({ title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi' })
  }

  async getDocument() {
    const contentDocument = this.getDocumentContent();

    return await this.generatePDF(
      contentDocument,
      {
        format: 'A4'
      }
    )
  }

  async getDocumentWithCover() {
    const coverContent = this.getCoverContent();
    const documentContent = this.getDocumentContent();

    const coverPDF = await this.generatePDF(
      coverContent,
      {
        format: 'A4'
      }
    );

    const documentPDF = await this.generatePDF(
      documentContent,
      {
        format: 'A4'
      }
    );

    const merger = new PDFMerger();
    await merger.add(coverPDF);
    await merger.add(documentPDF);

    return await merger.saveAsBuffer();
  }
}