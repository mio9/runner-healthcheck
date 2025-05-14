import { Octokit } from '@octokit/core'
import type { RunnerResponse } from '.';

const octokit = new Octokit({
  auth: process.env.GH_TOKEN
})

const response = await octokit.request('GET /orgs/swivelsoftware/actions/runners', {
  org: 'ORG',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

const runnerResponse = response.data as RunnerResponse;
const offlineRunners = runnerResponse.runners.filter(runner => runner.status === 'offline');

// list offline ids
console.log(offlineRunners.map(runner => runner.id));
// confirm prompt
const confirm = prompt(`Are you sure you want to delete ${offlineRunners.length} offline runners? (y/n)`);
if (confirm !== 'y') {
  console.log('Aborting deletion.');
  process.exit(0);
}

for (const runner of offlineRunners) {
  const response = await octokit.request('DELETE /orgs/swivelsoftware/actions/runners/{runner_id}', {
    runner_id: runner.id,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'   
    }
  });

  // show status
  console.log(`Deleted runner ${runner.id}: ${runner.name}`);
}