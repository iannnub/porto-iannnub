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

  it('profile resume CV exists on disk', () => {
    if (profileData.socials.resume) {
      const relativePath = profileData.socials.resume.replace(/^\//, '');
      const fullPath = path.join(publicDir, relativePath);
      const exists = fs.existsSync(fullPath);
      expect(exists, `CV file missing: ${profileData.socials.resume}`).toBe(true);
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
});
