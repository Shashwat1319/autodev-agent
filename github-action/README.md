# AutoDev Score Check

Fails CI when a GitHub profile's [AutoDev score](https://autodev-kappa.vercel.app) drops below a threshold.

## Usage

```yaml
- uses: Shashwat1319/autodev-agent@v1
  with:
    username: ${{ github.actor }}
    min-score: 50
```

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `username` | yes | — | GitHub username to check |
| `min-score` | no | `50` | Minimum acceptable score (0–100). CI fails below this. |
| `api-base` | no | `https://autodev-kappa.vercel.app` | AutoDev API base URL |

## Outputs

| Output | Description |
|--------|-------------|
| `score` | The profile's current AutoDev score (0–100) |
| `report-url` | Link to the full analysis report |

## Example: Guard your team's profiles

```yaml
name: Profile Guard

on:
  schedule:
    - cron: '0 9 * * 1'   # Every Monday 9am

jobs:
  check-score:
    runs-on: ubuntu-latest
    steps:
      - uses: Shashwat1319/autodev-agent@v1
        with:
          username: ${{ github.actor }}
          min-score: 60
```

## Why?

A GitHub profile is a developer's resume. Teams, bootcamps, and hiring managers can use this action to keep profile quality high automatically.

## License

MIT
