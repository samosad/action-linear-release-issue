import { LinearClient, IssueLabel } from '@linear/sdk';

interface IssueLabelGroup {
  id: string;
  name: string;
  color: string;
}

/**
 * Find a label by name for a specific team
 */
export async function findLabelByName(
  linearClient: LinearClient,
  teamId: string,
  labelName: string
): Promise<IssueLabel | null> {
  const labels = await linearClient.issueLabels({
    filter: { team: { id: { eq: teamId } } }
  });
  
  const label = labels.nodes.find((label: any) => 
    label.name === labelName
  );
  
  return label || null;
}

/**
 * Find a label group by name for a specific team
 */
export async function findLabelGroupByName(
  linearClient: LinearClient,
  teamId: string,
  groupName: string
): Promise<IssueLabelGroup | null> {
  const labels = await linearClient.issueLabels({
    filter: { team: { id: { eq: teamId } } }
  });
  
  const labelGroup = labels.nodes.find((label: any) => 
    label.isGroup && label.name === groupName
  );
  
  return labelGroup ? {
    id: labelGroup.id,
    name: labelGroup.name,
    color: labelGroup.color,
  } : null;
}

/**
 * Create a new label group for a team
 */
export async function createLabelGroup(
  linearClient: LinearClient,
  teamId: string,
  groupName: string,
  color: string = '#8b5cf6'
): Promise<IssueLabelGroup> {
  const response = await linearClient.createIssueLabel({
    teamId,
    name: groupName,
    color,
    // @ts-ignore - isGroup property might not be properly typed in SDK
    isGroup: true,
  });

  const labelGroup = await response.issueLabel;
  if (!labelGroup) {
    throw new Error(`Failed to create label group: ${groupName}`);
  }

  return {
    id: labelGroup.id,
    name: labelGroup.name,
    color: labelGroup.color,
  };
}

/**
 * Create a new label for a team
 */
export async function createLabel(
  linearClient: LinearClient,
  teamId: string,
  labelName: string,
  color: string = '#10b981'
): Promise<IssueLabel> {
  const response = await linearClient.createIssueLabel({
    teamId,
    name: labelName,
    color,
  });

  const label = await response.issueLabel;
  if (!label) {
    throw new Error(`Failed to create label: ${labelName}`);
  }

  return label;
}

/**
 * Create a new label within a label group
 */
export async function createLabelInGroup(
  linearClient: LinearClient,
  teamId: string,
  parentId: string,
  labelName: string,
  color: string = '#10b981'
): Promise<IssueLabel> {
  const response = await linearClient.createIssueLabel({
    teamId,
    name: labelName,
    color,
    parentId,
  });

  const label = await response.issueLabel;
  if (!label) {
    throw new Error(`Failed to create label: ${labelName}`);
  }

  return label;
}

/**
 * Find a label within a specific label group
 */
export async function findLabelInGroup(
  linearClient: LinearClient,
  teamId: string,
  parentId: string,
  labelName: string
): Promise<IssueLabel | null> {
  const labels = await linearClient.issueLabels({
    filter: { team: { id: { eq: teamId } } }
  });
  
  const label = labels.nodes.find((label: any) => 
    label.name === labelName && label.parent?.id === parentId
  );
  
  return label || null;
}

/**
 * Get or create a release tag label within a "tag" label group
 * This function ensures that:
 * 1. The "tag" label group exists
 * 2. The specific release tag label exists within the "tag" group
 * 3. Returns the label ID for assignment to issues
 */
export async function getOrCreateReleaseTagLabel(
  linearClient: LinearClient,
  teamId: string,
  releaseTag: string,
  releaseGroup: string
): Promise<string> {
  // Step 1: Check if "releaseGroup" label group exists
  let tagGroup = await findLabelGroupByName(linearClient, teamId, releaseGroup);
  
  // Step 2: Create "releaseGroup" group if it doesn't exist
  if (!tagGroup) {
    console.log(`🏷️  Creating ${releaseGroup} label group...`);
    tagGroup = await createLabelGroup(linearClient, teamId, releaseGroup);
    console.log(`✅ Created ${releaseGroup} label group`);
  } else {
    console.log(`✅ Found existing ${releaseGroup} label group`);
  }

  // Step 3: Check if the specific release tag exists in the group
  let releaseTagLabel = await findLabelInGroup(linearClient, teamId, tagGroup.id, releaseTag);
  
  // Step 4: Create the release tag label if it doesn't exist
  if (!releaseTagLabel) {
    console.log(`🏷️  Creating release tag label: ${releaseTag} in ${releaseGroup} group`);
    releaseTagLabel = await createLabelInGroup(
      linearClient,
      teamId,
      tagGroup.id,
      releaseTag
    );
    console.log(`✅ Created release tag label: ${releaseTag}`);
  } else {
    console.log(`✅ Found existing release tag label: ${releaseTag}`);
  }

  return releaseTagLabel.id;
}
