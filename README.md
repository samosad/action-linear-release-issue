# action-linear-release-issue

Creates Linear issues for GitHub releases.

- This GitHub action can be used to create a Linear issue for each new release in a GitHub project.
- It will take the changelog from the GitHub release body and append it to the created Linear issue description.
- It will try to find related Linear issues in the release body and link them to the created Linear issue.
- It will attach a GitHub release link to the created Linear issue.
- For the best results, use [Linear issue templates](https://linear.app/docs/issue-templates). You can set the issue assignee, status, labels, etc., via the template.

## Prerequisites

- You need to get a [Linear API key](https://linear.app/settings/api) and save it to your GitHub project secrets.
- You need to get the `teamId` for a Linear team where issues will be created. You can get the list of teams for your workspace in the [Linear API GraphQL explorer](https://studio.apollographql.com/public/Linear-API/variant/current/explorer?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABACoICGcAzkcADpJFEoXW0NNNIRgI32NOTAJZgOQokkoJxTAL7iFSOSDlA). (Use the API key for the Authorization header)

## Example GitHub workflow

In your GitHub project, create a new workflow file, for example: `.github/workflows/linear_release.yml`

> [!IMPORTANT]
> - You **must** use [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) to store `LINEAR_API_KEY`.
> - You can use [GitHub Actions variables](https://docs.github.com/en/actions/learn-github-actions/variables) to store `LINEAR_TEAM_ID`, `LINEAR_WORKSPACE`, `LINEAR_TEMPLATE_ID`. Or just hardcode values in the workflow file.

```yaml
name: Create Release issue in Linear

on:
  release:
    types: [created]

jobs:
  create_linear_release:
    runs-on: ubuntu-latest

    steps:
      - name: Create issue
        uses: samosad/action-linear-release-issue@v1
        with:
          linear-api-key: ${{ secrets.LINEAR_API_KEY }}
          linear-team-id: ${{ env.LINEAR_TEAM_ID }}
          linear-issue-title: "Release ${{ github.event.release.tag_name }}"
          linear-workspace: ${{ env.LINEAR_WORKSPACE }}
          linear-template-id: ${{ env.LINEAR_TEMPLATE_ID }}
          linear-issue-body: ${{ github.event.release.body }}
          linear-attachment-url: ${{ github.event.release.html_url }}
```
