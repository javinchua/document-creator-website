# Creating TradeTrust documents on Polygon Testnet (Mumbai) with no code

In this project we are tackling two main problems:

1. The **high upfront costs** of deploying the required contracts for a document on Ethreum mainnet
2. The **technical barriers** in creating a configuration file required to issue the documents

## Migration to Polygon

We have made various modifications to the codebase of the document creator site and TradeTrust website. This allows us to support the deployment of Token Registry and Title Escrow contracts on Polygon Testnet (Mumbai).

Beyond this, we will be looking into deployment on Polygon Mainnet.
This is also the first step in potential support for Multichain in the future.

## Issues with the current flow of creating documents

It is difficult for someone without technical knowledge to get setup, with the following reasons

- A long lists of prerequisites as detailed [here](https://docs.tradetrust.io/docs/document-creator/prerequisites)
- Knowledge of command line
- Have to look through documentation to figure out how to customize documents

Therefore we have created a user interface that will assist the user in creating their own wallet and form configuration file.
We achieved this by moving the processes that originally could only be done in the command line to the web frontend.

## Objectives Met

1. Testing on Mumbai testnet is complete. Users will soon be able to create and issue docuemnts on Polygon mainnet at low fees.
2. We have simplified the process of creating and issuing documents:
   - Before: Go through documentation and setting up local environment which requires a fair amount of **technical knowledge**
   - After: Complete deployment and configuration process through user interface in **a few clicks**

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run test:ci`

Launches the test runner in CI mode.

### `npm run prep`

Runs the lint:fix, test:ci and integration:concurrently:headless test scripts, make sure all passes before push to origin.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Integration test flow (locally)

- Firstly, you have to run build, as the integration run script will serve static.

- run 2 instances concurrently, 1 = `npm run blockchain`, 1 = `npm run integration`

- to test a specific file, you will need run 2 instances concurrently, 1 = `npm run blockchain`, 1 = `npm run integration:single integration/<file name>.spec.ts`

## Windows Gotchas

[cross-env](https://www.npmjs.com/package/cross-env) is required to run the npm scripts. It should be installed when running `npm install`

Encountered _File name differs from already included file name only in casing_ error? Ensure that the absolute paths specified in the error are _exactly_ the same and that the casings match.
