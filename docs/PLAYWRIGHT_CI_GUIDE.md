# Playwright on Continuous Integration

This document is a comprehensive guide for setting up and running Playwright tests in various Continuous Integration (CI) environments.

## Introduction

Playwright tests can be executed in CI environments. We have created sample configurations for common CI providers.

3 steps to get your tests running on CI:

1.  **Ensure CI agent can run browsers:** Use our Docker image in Linux agents or install your dependencies using the CLI.

2.  **Install Playwright:**
    ```bash
    # Install NPM packages
    npm ci

    # Install Playwright browsers and dependencies
    npx playwright install --with-deps
    ```

3.  **Run your tests:**
    ```bash
    npx playwright test
    ```

### Workers

We recommend setting workers to "1" in CI environments to prioritize stability and reproducibility. Running tests sequentially ensures each test gets the full system resources, avoiding potential conflicts. However, if you have a powerful self-hosted CI system, you may enable parallel tests. For wider parallelization, consider sharding - distributing tests across multiple CI jobs.

**playwright.config.ts**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
});
```

---

## CI Configurations

The Command line tools can be used to install all operating system dependencies in CI.

### GitHub Actions

**On push/pull_request**

Tests will run on push or pull request on branches main/master. The workflow will install all dependencies, install Playwright and then run the tests. It will also create the HTML report.

**.github/workflows/playwright.yml**
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

**Via Containers**

GitHub Actions support running jobs in a container by using the `jobs.<job_id>.container` option. This is useful to not pollute the host environment with dependencies and to have a consistent environment for e.g. screenshots/visual regression testing across different operating systems.

**.github/workflows/playwright.yml**
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  playwright:
    name: 'Playwright Tests'
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.55.0-noble
      options: --user 1001
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - name: Install dependencies
        run: npm ci
      - name: Run your tests
        run: npx playwright test
```

### Azure Pipelines

For Linux agents, you can use our Docker container with Azure Pipelines support running containerized jobs.

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18'
  displayName: 'Install Node.js'
- script: npm ci
  displayName: 'npm ci'
- script: npx playwright install --with-deps
  displayName: 'Install Playwright browsers'
- script: npx playwright test
  displayName: 'Run Playwright tests'
  env:
    CI: 'true'
```

### CircleCI

In order to specify the pre-built Playwright Docker image, simply modify the agent definition with `docker:` in your config.

```yaml
executors:
  pw-noble-development:
    docker:
      - image: mcr.microsoft.com/playwright:v1.55.0-noble
```

### Jenkins

Jenkins supports Docker agents for pipelines. Use the Playwright Docker image to run tests on Jenkins.

```groovy
pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright:v1.55.0-noble' } }
   stages {
      stage('e2e-tests') {
         steps {
            sh 'npm ci'
            sh 'npx playwright test'
         }
      }
   }
}
```

### Bitbucket Pipelines

To run Playwright tests on Bitbucket, use our public Docker image.

```yaml
image: mcr.microsoft.com/playwright:v1.55.0-noble
```

### GitLab CI

To run Playwright tests on GitLab, use our public Docker image.

```yaml
stages:
  - test

tests:
  stage: test
  image: mcr.microsoft.com/playwright:v1.55.0-noble
  script:
    - npm ci
    - npx playwright test
```

### Google Cloud Build

To run Playwright tests on Google Cloud Build, use our public Docker image.

```yaml
steps:
- name: mcr.microsoft.com/playwright:v1.55.0-noble
  script: 
    - npm ci
    - npx playwright test
  env:
  - 'CI=true'
```

### Drone

To run Playwright tests on Drone, use our public Docker image.

```yaml
kind: pipeline
name: default
type: docker

steps:
  - name: test
    image: mcr.microsoft.com/playwright:v1.55.0-noble
    commands:
      - npx playwright test
```

---

## Caching & Debugging

**Caching browsers**

Caching browser binaries is not recommended, since the amount of time it takes to restore the cache is comparable to the time it takes to download the binaries.

**Debugging browser launches**

Playwright supports the `DEBUG` environment variable to output debug logs. Setting it to `pw:browser` is helpful while debugging `Error: Failed to launch browser` errors.

```bash
DEBUG=pw:browser npx playwright test
```

**Running headed**

On Linux agents, headed execution requires Xvfb to be installed. To run browsers in headed mode with Xvfs, add `xvfb-run` before the actual command.

```bash
xvfb-run npx playwright test
```