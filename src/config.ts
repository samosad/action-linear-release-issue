import { getInput } from '@actions/core';

const {
  LINEAR_API_KEY = getInput('linear-api-key'),
  LINEAR_TEAM_ID = getInput('linear-team-id'),
  LINEAR_TEMPLATE_ID = getInput('linear-template-id'),
  LINEAR_ISSUE_TITLE = getInput('linear-issue-title'),
  LINEAR_ISSUE_BODY = getInput('linear-issue-body'),
  LINEAR_WORKSPACE = getInput('linear-workspace'),
  LINEAR_ATTACHMENT_URL = getInput('linear-attachment-url'),
  LINEAR_LABEL_RELEASE_GROUP = getInput('linear-label-release-group') || 'tag',
  LINEAR_LABEL_RELEASE_TAG = getInput('linear-label-release-tag'),
} = process.env;

const LINEAR_ISSUE_REGEX = /([A-Z]{2,10}-[0-9]{4,6})/g;

export {
  LINEAR_API_KEY,
  LINEAR_TEAM_ID,
  LINEAR_TEMPLATE_ID,
  LINEAR_ISSUE_TITLE,
  LINEAR_ISSUE_BODY,
  LINEAR_WORKSPACE,
  LINEAR_ATTACHMENT_URL,
  LINEAR_ISSUE_REGEX,
  LINEAR_LABEL_RELEASE_GROUP,
  LINEAR_LABEL_RELEASE_TAG
};
