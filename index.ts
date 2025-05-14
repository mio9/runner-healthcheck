import { Octokit } from '@octokit/core'

const octokit = new Octokit({
  auth: process.env.GH_TOKEN
})

export interface RunnerResponse {
  total_count: number;
  runners:     Runner[];
}

export interface Runner {
  id:        number;
  name:      string;
  os:        string;
  status:    string;
  busy:      boolean;
  ephemeral: boolean;
  labels:    Label[];
}

export interface Label {
  id:   number;
  name: string;
  type: string;
}


const response = await octokit.request('GET /orgs/swivelsoftware/actions/runners', {
  org: 'ORG',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

// Show rate limit information
console.log('Rate limit information:');
console.log('  Rate limit remaining:', response.headers['x-ratelimit-remaining']);
console.log('  Rate limit reset:', new Date(response.headers['x-ratelimit-reset'] * 1000).toISOString());

const runnerResponse = response.data as RunnerResponse;

const onlineRunners = runnerResponse.runners
  .map(runner => {
    const { labels, ...rest } = runner;
    return rest as Omit<Runner, 'labels'>;
  })
  .filter(runner => runner.status === 'online')

// show online runners as table
console.table(onlineRunners)