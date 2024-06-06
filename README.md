# action-linear-release-issue

Creates Linear issue for GitHub release.

- This GitHub action can be used to create a Linear issue for each new release in GitHub project.
- It will take changelog from GitHub release body and append it to created Linear issue description.
- It will try to find related Linear issues in release body and link them to created Linear issue.
- It will attach a GitHub release link to created Linear issue. 
- For the best results use [Linear issue templates](https://linear.app/docs/issue-templates). You can set issue assignee, status, labels etc. via template. 

## Prerequisites 

- You have to get [Linear API key](https://linear.app/settings/api) and save it to your GitHub project secrets.
- You have to get `teamId` for a Linear team where issues will be created. You can get teams list for your workspace in [Linear API Graphql explorer](https://studio.apollographql.com/public/Linear-API/variant/current/explorer?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CeABACoICGcAzkcADpJFEoXW0NNNIRgI32NOTAJZgOQokkoJxTAL7iFSOSDlA). (Use API key for Authorization header) 

## Example GitHub workflow

In your GitHub project create new workflow file, for example: `.github/workflows/linear_release.yml`

> **Note** 
> - You **have** to use [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) to store `LINEAR_API_KEY`. 
> - You can use [GitHub Actions variables](https://docs.github.com/en/actions/learn-github-actions/variables) to store `LINEAR_TEAM_ID`, `LINEAR_WORKSPACE`, `LINEAR_TEMPLATE_ID` or just hardcode values in the workflow file.   

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