const fs = require('fs')
const YAML = require('yaml')
const core = require('@actions/core')

const configPath = `${process.env.HOME}/jira/config.yml`
const Action = require('./action')

const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

async function exec () {
  try {
    const result = await new Action({
      argv: parseArgs(),
      config,
    }).execute()

    core.setOutput('changelog', result.formattedIssues)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

function parseArgs () {
  /*
  const transition = core.getInput('transition')
  const transitionId = core.getInput('transitionId')
  if (!transition && !transitionId) {
    // Either transition _or_ transitionId _must_ be provided
    throw new Exception("Error: please specify either a transition or transitionId")
  }
  return {
    issue: core.getInput('issue'),
    transition,
    transitionId
  }
  */
  return {
    fromBranch: core.getInput('from_branch'),
    toBranch: core.getInput('to_branch'),
    issueFormatter: core.getInput('issue_format')
  }
}

exec()