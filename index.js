const fs = require('fs')
const YAML = require('yaml')
const core = require('@actions/core')
const { execSync } = require('child_process');

const configPath = `${process.env.HOME}/jira/config.yml`
const Action = require('./action')

const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

async function exec () {
  try {
    const result = await new Action({
      argv: parseArgs(),
      config,
    }).execute()

    console.log(result.formattedIssues)
    //core.setOutput('changelog', result.formattedIssues)
    
    execSync(`::set-output name=changelog::'${result.formattedIssues}'`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

function parseArgs () {
  return {
    fromBranch: core.getInput('from_branch'),
    toBranch: core.getInput('to_branch'),
    issueFormatter: core.getInput('issue_format')
  }
}

exec()