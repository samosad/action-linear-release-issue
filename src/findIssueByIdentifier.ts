import { LinearClient } from '@linear/sdk';

export async function findIssueByIdentifier(linearClient: LinearClient, issueIdentifier: string) {
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
    console.error('Error finding issue', error);
    return null;
  }
}
