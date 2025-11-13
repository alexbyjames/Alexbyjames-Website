import { test } from "node:test";
import assert from "node:assert/strict";

import {
  featuredSections,
  projectMapBySlug,
  type FeaturedProjectWithSection,
} from "../lib/featuredSections";
import { getEmbedSrc } from "../lib/embed";

test("project slugs are unique", () => {
  const seen = new Set<string>();

  featuredSections.forEach((section) => {
    section.projects.forEach((project) => {
      assert.ok(project.slug, `Missing slug for project "${project.title}"`);
      assert.ok(
        !seen.has(project.slug),
        `Duplicate slug detected: ${project.slug}`,
      );
      seen.add(project.slug);
    });
  });
});

test("project maps resolve slugs to sections", () => {
  Object.entries(projectMapBySlug).forEach(([slug, project]) => {
    assert.equal(
      project.slug,
      slug,
      `projectMapBySlug misaligned for slug ${slug}`,
    );
  });
});

test("embedded projects have valid providers and roles", () => {
  const projectsWithEmbeds: FeaturedProjectWithSection[] = [];

  featuredSections.forEach((section) => {
    section.projects.forEach((project) => {
      if (project.embed) {
        projectsWithEmbeds.push({ ...project, section: section.id });
      }
    });
  });

  assert.ok(projectsWithEmbeds.length > 0, "No embedded projects detected");

  projectsWithEmbeds.forEach((project) => {
    assert.ok(project.href, `Missing href for embedded project ${project.title}`);
    const embedSrc = getEmbedSrc(project.href!);
    assert.ok(
      embedSrc,
      `Unable to derive embed src for ${project.title} (${project.href})`,
    );
    assert.ok(
      project.role,
      `Embedded project ${project.title} should declare a role`,
    );
  });
});

