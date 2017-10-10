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

function makeRequest(language) {
  fetch(buildGitignoreUrl(language)).then(response => {
    if (response.ok) {
      return handleResponse(response);
    } else {
      console.log(response.statusText);
    }
  }).catch(error => {
    console.log(error);
  });
}

makeRequest(process.argv[2]);
