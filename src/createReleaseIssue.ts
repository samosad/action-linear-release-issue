import { LinearClient } from '@linear/sdk';
import { linkIssues } from 'src/linkIssues';
import { getOrCreateReleaseTagLabel } from 'src/labelManager';
import {
  LINEAR_ISSUE_REGEX,
  LINEAR_ATTACHMENT_URL,
  LINEAR_ISSUE_BODY,
  LINEAR_ISSUE_TITLE,
  LINEAR_TEAM_ID,
  LINEAR_TEMPLATE_ID,
  LINEAR_WORKSPACE,
  LINEAR_LABEL_RELEASE_GROUP,
  LINEAR_LABEL_RELEASE_TAG,
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

  // Add release tag label if provided
  if (LINEAR_LABEL_RELEASE_TAG) {
    try {
      console.log(`🏷️  Processing release tag: ${LINEAR_LABEL_RELEASE_TAG}`);
      const labelId = await getOrCreateReleaseTagLabel(
        linearClient,
        LINEAR_TEAM_ID,
        LINEAR_LABEL_RELEASE_TAG,
        LINEAR_LABEL_RELEASE_GROUP
      );
      
      // Refetch the issue to get current labels (in case template added some)
      const refreshedIssue = await linearClient.issue(releaseIssue.id);
      const labelConnection = await refreshedIssue?.labels();
      const currentLabels = labelConnection?.nodes?.map((label: any) => label.id) || [];
      
      // Update the issue with the release tag label (append to existing labels)
      await linearClient.updateIssue(releaseIssue.id, {
        labelIds: [...currentLabels, labelId],
      });
      
      console.log(`✅ Added release tag label "${LINEAR_LABEL_RELEASE_TAG}" to issue ${releaseIssue.identifier}`);
    } catch (error) {
      console.error(`❌ Failed to add release tag label: ${error}`);
      // Don't throw the error to avoid breaking the main flow
    }
  }

  return releaseIssue;
}
