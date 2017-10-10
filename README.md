# get-gitignore

Download a `.gitignore` template for a given language or framework.

## Installation

`npm install --global get-gitignore`

## Usage

`get-gitignore <name>`, where `name` is the name of a language or framework listed in https://github.com/github/gitignore/.

## Git alias

Add the following to your `.gitconfig`:

```
[alias]
	ignore = "!f() { get-gitignore ${1} }; f"
```

Then, run `git ignore <name>` to download a `.gitignore` template.
