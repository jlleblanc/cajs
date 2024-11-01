#!/usr/bin/env node
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const nextConfig = `
const { withCAJS } = require('cajs-next/plugin');

module.exports = withCAJS({
  // Your Next.js config
});
`;

function init() {
  // Install dependencies
  execSync('npm install cajs-next --save');

  // Create next.config.js
  writeFileSync('next.config.js', nextConfig);

  // Create pages directory if it doesn't exist
  execSync('mkdir -p pages');

  console.log('CAJS initialized in your Next.js project!');
}

init();