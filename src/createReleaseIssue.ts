import { LinearClient } from '@linear/sdk';
import { linkIssues } from 'src/linkIssues';
import {
  LINEAR_ISSUE_REGEX,
  LINEAR_ATTACHMENT_URL,
  LINEAR_ISSUE_BODY,
  LINEAR_ISSUE_TITLE,
  LINEAR_TEAM_ID,
  LINEAR_TEMPLATE_ID,
  LINEAR_WORKSPACE,
} from './config';

export async function createReleaseIssue(linearClient: LinearClient) {
  const response = await linearClient.createIssue({
    teamId: LINEAR_TEAM_ID,
    title: LINEAR_ISSUE_TITLE,
    templateId: LINEAR_TEMPLATE_ID,
  });

  const releaseIssue = await response.issue;

  if (!releaseIssue) {
    throw new Error('Issue not found');
  }

  console.log('\n🚢 Created release issue:');
  console.log(releaseIssue.identifier);
  console.log(releaseIssue.title);
  console.log(releaseIssue.url);

  if (LINEAR_ISSUE_BODY) {
    await linearClient.updateIssue(releaseIssue.id, {
      description:
        releaseIssue.description +
        '\n\n' +
        LINEAR_ISSUE_BODY.replace(LINEAR_ISSUE_REGEX, `[$1](https://linear.app/${LINEAR_WORKSPACE}/issue/$1/)`),
    });
  }

  if (LINEAR_ATTACHMENT_URL) {
    await linearClient.attachmentLinkURL(releaseIssue.id, LINEAR_ATTACHMENT_URL, {
      title: LINEAR_ISSUE_TITLE,
    });
  }

  await linkIssues(linearClient, releaseIssue);

  return releaseIssue;
}
