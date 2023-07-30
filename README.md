# Life in Peach (CMS API)

This project provides a Content Management System (CMS) API built on top of Firebase and Firestore. It allows you to manage and deliver digital content to various types of applications.

## Dependencies

This project uses various packages and technologies. The primary ones are Firebase, Firestore, Express, Apollo Server Express, and GraphQL. See `package.json` for a full list of dependencies and devDependencies.

## Setting Up

### Pre-requisites

To run this project locally, you need:

- Node.js 16
- NPM
- Firebase CLI
- Access to a Firebase project

### Environment Variables

Copy the `.env.example` file and rename it to `.env`. Replace the placeholder values with your actual configuration:

````
CONFIG_TOKEN="your-firebase-token"
CONFIG_ENV="your-environment"
CONFIG_PROJECT_ID="your-firebase-project-id"```

## Installing Dependencies

In the project directory, run `npm install` to install all dependencies.

## Building and Running the Project

To build the project, run `npm run build`. This will compile the TypeScript files and generate JavaScript files in the `lib/` directory.

To start the project, run `npm run dev`. This will start the Firebase emulator.

## Scripts

Here are some useful NPM scripts defined in `package.json`:

- `npm run build`: Build the project.
- `npm run serve`: Build and start the project and run emulator.
- `npm run deploy`: Deploy the functions to Firebase to prod.
- `npm run deploy:staging`: Deploy the functions to Firebase to staging.
- `npm run logs`: View the Firebase functions logs.
- `npm run fb:dev`: Switch Firebase to the dev project.
- `npm run fb:prod`: Switch Firebase to the prod project.


````
