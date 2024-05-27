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

import { Issue, LinearClient } from '@linear/sdk';
import { IssueRelationType } from '@linear/sdk/dist/_generated_documents';

const {
  LINEAR_API_KEY,
  LINEAR_TEAM_ID = '',
  LINEAR_TEMPLATE_ID,
  LINEAR_ISSUE_TITLE,
  LINEAR_ISSUE_BODY = '',
  LINEAR_WORKSPACE,
  LINEAR_ATTACHMENT_URL,
} = process.env;

const ISSUE_NUMBER_REGEX = /([A-Z]{2,10}-[0-9]{4,6})/g;

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

async function createReleaseIssue(linearClient: LinearClient) {
  try {
    const response = await linearClient.createIssue({
      teamId: LINEAR_TEAM_ID,
      title: LINEAR_ISSUE_TITLE,
      templateId: LINEAR_TEMPLATE_ID,
    });

    const releaseIssue = await response.issue;

    if (!releaseIssue) {
      throw new Error('Issue not found');
    }

    console.log('Created release issue:', releaseIssue.identifier, releaseIssue.title);
    console.log(releaseIssue.url);

    if (LINEAR_ISSUE_BODY) {
      await linearClient.updateIssue(releaseIssue.id, {
        description:
          releaseIssue.description +
          '\n\n' +
          LINEAR_ISSUE_BODY.replace(ISSUE_NUMBER_REGEX, `[$1](https://linear.app/${LINEAR_WORKSPACE}/issue/$1/)`),
      });
    }

    if (LINEAR_ATTACHMENT_URL) {
      await linearClient.attachmentLinkURL(releaseIssue.id, LINEAR_ATTACHMENT_URL, {
        title: LINEAR_ISSUE_TITLE,
      });
    }

    await linkIssues(linearClient, releaseIssue);
  } catch (e) {
    console.error(`Unable to create release issue, ${e}`);
  }
}

async function linkIssues(linearClient: LinearClient, releaseIssue: Issue) {
  for (const issueId of LINEAR_ISSUE_BODY.match(ISSUE_NUMBER_REGEX) ?? []) {
    try {
      const issue = await findIssueByIdentifier(linearClient, issueId);

      if (issue) {
        await linearClient.createComment({
          body: `[${LINEAR_ISSUE_TITLE}](https://linear.app/${LINEAR_WORKSPACE}/issue/${releaseIssue.identifier}/)`,
          issueId: issue.id,
        });
        console.log('Added comment:', issueId);

        await linearClient.createIssueRelation({
          issueId: issue.id,
          relatedIssueId: releaseIssue.id,
          type: IssueRelationType.Related,
        });
        console.log('Added related issue:', issueId);
      }
    } catch (e) {
      console.error(`Unable to link linear issue to release, ${e}`);
    }
  }
}

async function findIssueByIdentifier(linearClient: LinearClient, issueIdentifier: string) {
  try {
    const response = await linearClient.client.rawRequest(
      `
          query($id: String!) {
              issue(id: $id) {
                  id
              }
          }
      `,
      { id: issueIdentifier },
    );

    // @ts-ignore
    return response.data.issue;
  } catch (error) {
    console.error('Error finding issue:', error);
    return null;
  }
}
