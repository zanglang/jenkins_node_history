## Introduction

This script scrapes a Jenkins node's 'Build History' page for builds, and returns a JSON in the following format.

    {
        [
            ['<job name>', '<build time>'],
        ]
    }

## Requirements

- `PhantomJS 1.9+`
- `CasperJS 1.1+`

