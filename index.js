const fs = require('fs-extra');
const fetch = require('node-fetch');

function buildGitignoreUrl(language) {
  return `https://github.com/github/gitignore/raw/master/${language}.gitignore`;
}

function handleResponse(response) {
  response.text().then(text => {
    const match = /^(.*)\.gitignore$/.exec(text);
    if (match === null) {
      return fs.writeFile('./.gitignore', text);
    } else {
      return makeRequest(match[1]);
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

function makeRequest(language) {
  fetch(buildGitignoreUrl(language)).then(response => {
    if (response.ok) {
      return handleResponse(response);
    } else {
      handleError(response, language);
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
