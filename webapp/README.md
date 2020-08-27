# OrcaAL's Web App

**OrcaAL** is an active learning tool to help an orca detection model perform better.

**The Web App** runs on the client's side and makes use orcaAL's API.

## Getting Started

-   Make sure [Node.js](http://nodejs.org) is installed
-   Clone the repo and `cd` into the project directory
-   Run `npm install` to install all the dependencies
-   Run `npm start` to start a development server in [http://localhost:8080](http://localhost:8080) (For the app to work correctly, you need to start the API server as well)
-   We're using ESLint and Prettier, so if you use VSCode, download their extensions so that the tools are run automatically

### Testing

-   Start a development server with `npm start`
-   Run `npm t`
-   Once cypress is open, click on `sample.spec.js` to run the integration tests

### Deployment

-   `npm run build` builds the production code to the `dist` folder
-   Then use the `npm run deploy` command to publish the dist folder to the gh-pages branch on GitHub

## References

This code uses a fork of [chrome music lab's spectrogram](https://github.com/googlecreativelab/chrome-music-lab/tree/master/spectrogram) for rendering/playing audio.

Icons used come from [www.flaticon.com](https://www.flaticon.com)
