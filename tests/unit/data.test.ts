import { describe, it, expect } from 'vitest';
import { profileData } from '../../src/data/profile';
import { experienceData } from '../../src/data/experience';
import { projectsData } from '../../src/data/projects';
import { skillsData } from '../../src/data/skills';
import { certificationsData } from '../../src/data/certifications';

describe('Data Integrity', () => {
  it('profileData has required fields', () => {
    expect(profileData.name).toBeTruthy();
    expect(profileData.headline.length).toBeGreaterThan(0);
    expect(profileData.about.length).toBeGreaterThan(0);
    expect(profileData.stats).toBeDefined();
    expect(profileData.socials).toBeDefined();
  });

  it('experienceData items have required fields', () => {
    expect(experienceData.length).toBeGreaterThan(0);
    experienceData.forEach(exp => {
      expect(exp.id).toBeTruthy();
      expect(exp.title).toBeTruthy();
      expect(exp.company).toBeTruthy();
      expect(exp.date).toBeTruthy();
      expect(exp.bullets.length).toBeGreaterThan(0);
    });
  });

  it('projectsData items have required fields', () => {
    expect(projectsData.length).toBeGreaterThan(0);
    projectsData.forEach(project => {
      expect(project.id).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.skills).toBeDefined();
    });
  });

  it('skillsData items have required fields', () => {
    expect(skillsData.length).toBeGreaterThan(0);
    skillsData.forEach(category => {
      expect(category.category).toBeTruthy();
      expect(category.skills.length).toBeGreaterThan(0);
    });
  });

  it('certificationsData items have required fields', () => {
    expect(certificationsData.length).toBeGreaterThan(0);
    certificationsData.forEach(cert => {
      expect(cert.id).toBeTruthy();
      expect(cert.title).toBeTruthy();
      expect(cert.issuer).toBeTruthy();
      expect(cert.date).toBeTruthy();
    });
  });
});
