import express from 'express';
import { chromium } from 'playwright';

const app = express();
app.use(express.json({ limit: '20mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/render-pdf', async (req, res) => {
  const { html, options = {} } = req.body ?? {};

  if (typeof html !== 'string' || html.trim() === '') {
    res.status(400).json({ error: '`html` is required.' });
    return;
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.setContent(html, { waitUntil: 'networkidle' });

    const pdf = await page.pdf({
      format: options.format ?? 'A4',
      landscape: Boolean(options.landscape ?? false),
      printBackground: Boolean(options.printBackground ?? true),
      preferCSSPageSize: Boolean(options.preferCSSPageSize ?? true),
      margin: options.margin ?? { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' }
    });

    await context.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdf));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate PDF';
    res.status(500).json({ error: message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, '0.0.0.0');
