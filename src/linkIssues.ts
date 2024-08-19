import { Issue, LinearClient, LinearDocument } from '@linear/sdk';
import { findIssueByIdentifier } from 'src/findIssueByIdentifier';
import { LINEAR_ISSUE_REGEX, LINEAR_ISSUE_BODY, LINEAR_ISSUE_TITLE, LINEAR_WORKSPACE } from 'src/config';
import { IssueRelationType } from '@linear/sdk/dist/_generated_documents';

export async function linkIssues(linearClient: LinearClient, releaseIssue: Issue) {
  for (const issueId of LINEAR_ISSUE_BODY.match(LINEAR_ISSUE_REGEX) ?? []) {
    const issue = await findIssueByIdentifier(linearClient, issueId);

    if (issue) {
      await linearClient.createComment({
        body: `[${LINEAR_ISSUE_TITLE}](https://linear.app/${LINEAR_WORKSPACE}/issue/${releaseIssue.identifier}/)`,
        issueId: issue.id,
      });

      console.log('\n🚢 Added comment:', issueId);

      await linearClient.createIssueRelation({
        issueId: issue.id,
        relatedIssueId: releaseIssue.id,
        type: LinearDocument.IssueRelationType.Related,
      });

      console.log('\n🚢 Added related issue:', issueId);
    }
  }
}
