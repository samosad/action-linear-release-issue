import { LinearClient } from '@linear/sdk';

export async function findIssueByIdentifier(linearClient: LinearClient, issueIdentifier: string) {
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
}
