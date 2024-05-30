import { setFailed, setOutput } from '@actions/core';

import { LinearClient } from '@linear/sdk';
import { createReleaseIssue } from 'src/createReleaseIssue';
import { LINEAR_API_KEY } from 'src/config';

(async () => {
  try {
    const linearClient = new LinearClient({
      apiKey: LINEAR_API_KEY,
    });

    const releaseIssue = await createReleaseIssue(linearClient);

    if (releaseIssue) {
      setOutput('linear-release-issue-url', releaseIssue.url);
      setOutput('linear-release-issue-identifier', releaseIssue.identifier);
      setOutput('linear-release-issue-title', releaseIssue.title);
    }
  } catch (error) {
    console.error('Unable to create linear client', error);
    setFailed(error instanceof Error ? error : 'Unable to create linear client');
  }
})();
