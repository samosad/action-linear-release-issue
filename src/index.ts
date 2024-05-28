// const core = require('@actions/core');
// const github = require('@actions/github');
//
// try {
//   // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput('who-to-greet');
//   console.log(`Hello ${nameToGreet}!`);
//   const time = new Date().toTimeString();
//   core.setOutput('time', time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2);
//   console.log(`The event payload: ${payload}`);
// } catch (error) {
//   core.setFailed(error.message);
// }

import { LinearClient } from '@linear/sdk';
import { createReleaseIssue } from 'src/createReleaseIssue';
import { LINEAR_API_KEY } from 'src/config';

(async () => {
  try {
    const linearClient = new LinearClient({
      apiKey: LINEAR_API_KEY,
    });

    await createReleaseIssue(linearClient);
  } catch (e) {
    console.error('Unable to create linear client');
  }
})();
