const _ = require('lodash')
const Jira = require('./common/net/Jira')
const { execSync } = require('child_process');

//const issueFormatter = '- <${issue.self}|${issue.key}> ${issue.fields["summary"]}'

module.exports = class {
  constructor({ argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
  }

  async execute() {
    const { argv } = this

    console.log(`GITHUB_WORKSPACE = ${process.env.GITHUB_WORKSPACE}`)
    console.log(`get log git by range origin/${argv.fromBranch}..origin/${argv.toBranch}`)
    const gitCommits = execSync(`git --git-dir ${process.env.GITHUB_WORKSPACE}/.git log origin/${argv.fromBranch}..origin/${argv.toBranch} --oneline --no-merges`).toString()

    var issueIds = gitCommits.split("\n")
      .map(line => {
        var result = line.match('[A-Z]+-[0-9]+')

        if (result) {
          return result[0]
        }
      })
      .filter(issueOrNull => {
        return issueOrNull != null
      })

    var issueIds = Array.from(new Set(issueIds))

    var issues = Array()
    for (const issueId of issueIds) {
      console.log(`fetching issue ${issueId}`)
      issues.push(await this.Jira.getIssue(issueId))
    }

    var formattedIssues = issues.map(issue => {
      return eval('`'+argv.issueFormatter+'`')
    }).join("\r\n")

    return { formattedIssues }
  }
}