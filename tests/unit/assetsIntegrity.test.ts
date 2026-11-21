import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { certificationsData } from '../../src/data/certifications';
import { projectsData } from '../../src/data/projects';
import { profileData } from '../../src/data/profile';

const publicDir = path.resolve(__dirname, '../../public');

describe('Public Assets Integrity Check', () => {
  it('all certificate image thumbnails and PDFs exist on disk', () => {
    certificationsData.forEach((cert) => {
      if (cert.image) {
        // Strip leading slash
        const relativePath = cert.image.replace(/^\//, '');
        const fullPath = path.join(publicDir, relativePath);
        const exists = fs.existsSync(fullPath);
        expect(exists, `Certificate thumbnail missing: ${cert.image}`).toBe(true);
      }
      if (cert.file) {
        const relativePath = cert.file.replace(/^\//, '');
        const fullPath = path.join(publicDir, relativePath);
        const exists = fs.existsSync(fullPath);
        expect(exists, `Certificate PDF missing: ${cert.file}`).toBe(true);
      }
    });
  });

  it('all project gallery images exist on disk', () => {
    projectsData.forEach((project) => {
      if (project.images && project.images.length > 0) {
        project.images.forEach((img) => {
          const relativePath = img.replace(/^\//, '');
          const fullPath = path.join(publicDir, relativePath);
          const exists = fs.existsSync(fullPath);
          expect(exists, `Project screenshot missing: ${img} in ${project.id}`).toBe(true);
        });
      }
    });
  });

  it('profile resume CV and portfolio PDF exist on disk', () => {
    if (profileData.socials.resume) {
      const relativePath = profileData.socials.resume.replace(/^\//, '');
      const fullPath = path.join(publicDir, relativePath);
      const exists = fs.existsSync(fullPath);
      expect(exists, `CV file missing: ${profileData.socials.resume}`).toBe(true);
    }
    expect(profileData.socials.portfolioPdf).toBeTruthy();
    if (profileData.socials.portfolioPdf) {
      const relativePath = profileData.socials.portfolioPdf.replace(/^\//, '');
      const fullPath = path.join(publicDir, relativePath);
      const exists = fs.existsSync(fullPath);
      expect(exists, `Portfolio PDF missing: ${profileData.socials.portfolioPdf}`).toBe(true);
    }
  });

  it('essential static assets exist (spiderman, engine audio, favicon)', () => {
    const essentialAssets = ['spiderman.png', 'jdm-engine.mp3', 'favicon.svg'];
    essentialAssets.forEach((asset) => {
      const fullPath = path.join(publicDir, asset);
      const exists = fs.existsSync(fullPath);
      expect(exists, `Essential asset missing: ${asset}`).toBe(true);
    });
  });

  it('SEO, GEO, and Social Preview assets exist and index.html has valid JSON-LD & strict CSP', () => {
    const seoAssets = ['robots.txt', 'sitemap.xml', 'llms.txt', 'og-image.jpg'];
    seoAssets.forEach((asset) => {
      const fullPath = path.join(publicDir, asset);
      expect(fs.existsSync(fullPath), `SEO asset missing: ${asset}`).toBe(true);
      expect(fs.statSync(fullPath).size).toBeGreaterThan(0);
    });

    const indexHtmlPath = path.resolve(__dirname, '../../index.html');
    const html = fs.readFileSync(indexHtmlPath, 'utf-8');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('property="og:image:type" content="image/jpeg"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).not.toContain("'unsafe-eval'");

    const jsonLdMatch = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
    );
    expect(jsonLdMatch).toBeTruthy();
    const parsedJsonLd = JSON.parse(jsonLdMatch![1]);
    expect(parsedJsonLd['@context']).toBe('https://schema.org');
    expect(Array.isArray(parsedJsonLd['@graph'])).toBe(true);
  });

  it('WCAG 2.2 AA foreground text tokens meet >= 4.5:1 contrast against dark backgrounds', () => {
    const hexToLuminance = (hex: string) => {
      const clean = hex.replace('#', '');
      const r = parseInt(clean.slice(0, 2), 16) / 255;
      const g = parseInt(clean.slice(2, 4), 16) / 255;
      const b = parseInt(clean.slice(4, 6), 16) / 255;
      const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
      return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    };
    const contrastRatio = (c1: string, c2: string) => {
      const l1 = hexToLuminance(c1);
      const l2 = hexToLuminance(c2);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const fgTokens = ['#F5F5F7', '#A1A1B0', '#FF5C61', '#5B9CFF'];
    const bgTokens = ['#0A0A0F', '#12121A'];

    for (const fg of fgTokens) {
      for (const bg of bgTokens) {
        expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
      }
    }
    expect(contrastRatio('#FFFFFF', '#E0282E')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#FFFFFF', '#2D6CDF')).toBeGreaterThanOrEqual(4.5);
  });
});
