import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readability } from '@mozilla/readability';
import got from 'got';
import { JSDOM } from 'jsdom';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.query?.url) {
    got(request.query.url as string).then(r => {
      const doc = new JSDOM(r.body, { url: request.query.url as string });
      const reader = new Readability(doc.window.document);
      const article = reader.parse();
      console.log(article);
      response.setHeader('Content-Type', 'text/html');
      response.status(200).send(article?.content);
    }).catch(err => {
      console.log(err);
      response.status(200).json({
        body: request.body,
        query: request.query,
        cookies: request.cookies,
      });
    });
  } else {
    response.status(200).json({
      body: request.body,
      query: request.query,
      cookies: request.cookies,
    });
  }
}
