import { Issue, LinearClient } from '@linear/sdk';
import { findIssueByIdentifier } from 'src/findIssueByIdentifier';
import { LINEAR_ISSUE_REGEX, LINEAR_ISSUE_BODY, LINEAR_ISSUE_TITLE, LINEAR_WORKSPACE } from 'src/config';

export async function linkIssues(linearClient: LinearClient, releaseIssue: Issue) {
  for (const issueId of LINEAR_ISSUE_BODY.match(LINEAR_ISSUE_REGEX) ?? []) {
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
          // @ts-ignore
          type: 'related',
        });
        console.log('Added related issue:', issueId);
      }
    } catch (e) {
      console.error(`Unable to link linear issue to release, ${e}`);
    }
  }
}
