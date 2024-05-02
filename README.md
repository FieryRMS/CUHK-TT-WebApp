# CUHK-TT-WebApp

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
[![deploy status](https://img.shields.io/github/actions/workflow/status/FieryRMS/CUHK-TT-WebApp/clasp.yml?label=deploy
)](https://fieryrms.github.io/CUHK-TT-WebApp)

A google Appscript webapp that gets and adds CUHK class schedule to google calendar.

Demo: <https://fieryrms.github.io/CUHK-TT-WebApp>

## Development

1. install clasp and login

    ```bash
    npm install -g @google/clasp
    clasp login
    ```

1. Clone the project locally

1. Create a new project in Google Appscript

1. Get your script ID from the project settings

1. Init clasp in the project folder. Replace `YOUR_SCRIPT_ID` with your script ID

    ```bash
    clasp create --parentId "YOUR_SCRIPT_ID"
    ```

1. Push the project to the cloud

    ```bash
    npm run push
    ```

    or

    ```bash
    npm run livepush
    ```

1. Refresh and create a development deployment from the website to test the webapp

1. After you are done, push and refresh the website and deploy the webapp

    ```bash
    clasp deploy
    ```

1. To deploy the webapp to the same deployment in the future, create a `.npmrc` file with,

    ```ini
    deploymentid = 'YOUR_DEPLOYMENT_ID'
    ```

    and run

    ```bash
    npm run deploy
    ```
