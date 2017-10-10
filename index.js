#! /usr/bin/env node
const fs = require('fs-extra');
const fetch = require('node-fetch');

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function buildGitignoreUrl(language) {
  return `https://github.com/github/gitignore/raw/master/${capitalize(language)}.gitignore`;
}

function handleResponse(response, language) {
  response.text().then(text => {
    const match = /^(.*)\.gitignore$/.exec(text);
    if (match === null) {
      return fs.writeFile('./.gitignore', text).then(() => {
        console.log(`Template for ${language} written to .gitignore.`);
      });
    } else {
      return makeRequest(match[1], language);
    }
  })
}

function handleError(response, language) {
  switch (response.status) {
    case 404:
      console.error(`No .gitignore template found for "${language}".`);
      break;
    default:
      console.error("An error occurred.");
      break;
  }

  process.exit(1);
}

function makeRequest(language, originalLanguage) {
  fetch(buildGitignoreUrl(language)).then(response => {
    if (response.ok) {
      return handleResponse(response, originalLanguage || language);
    } else {
      handleError(response, originalLanguage);
    }
  }).catch(error => {
    console.log(error);
  });
}

const language = process.argv[2];

if (language) {
  makeRequest(language);
} else {
  console.error("Usage: get-gitignore <language>");
  process.exit(64);
}
