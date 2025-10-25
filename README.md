# Notifications Import
This service polls notifications from a YouTrack instance and sends them to a Slack channel.
It supports a slash-command in Slack to create new YouTrack issues via modal interaction.

A video demonstration: https://drive.google.com/file/d/1CpehkiVoguUe8jcBsWTraPvmn_wSbAMo/view?usp=drivesdk

## Architecture
- A **poller** periodically retrieves notifications from YouTrack
- A **local SQLiteCache** stores notification IDs already sent, so duplicates aren’t posted.
- For Slack integration:
    - Slash command `/youtrack create` triggers a modal to gather issue details(summary and project's short name).
    - Submission of the modal calls the YouTrack API to get the project id by short name and to create an issue.
- The Express app uses middleware to parse bodies and verify Slack signatures, ensuring that the request actually comes from Slack.

### Polling Workflow
- At startup, the poller begins a loop every given interval(in my case 1 minute).
- It calls YouTrack’s notifications endpoint, retrieves new notifications.
- For each notification not in SQLite cache:
    - Decode and unzip message
    - Format into into markdown
    - Send via Slack API
    - Insert ID into cache
- This ensures each notification is sent once only.

### Slack Command Workflow
- User types `/youtrack create`
- Server responds immediately (200 OK) and opens a modal for input (via views.open).
- User fills modal and submits → /slack/interactions receives payload.
- The server creates an issue in YouTrack and sends an ephemeral Slack message confirming.


## Prerequisites
- A **YouTrack API token** with permissions to create issues.
- Slack
  - **Slack App** configured with permissions `chat:writes` and `commands`.
  - **Slack command** `/youtrack` configured.
  - **Request URLs** set for commands and interactions.
  - **Slack token and signing secret**
- **Node.js** (>= 14, 16 or whichever version you target).
- A **tunnel / public endpoint** (I used ngrok) for Slack commands.

## Configuration
The service expects the .env file:

```python
YOUTRACK_TOKEN=<your_token>
YOUTRACK_BASE_URL=https://your-instance.youtrack.cloud/api
SLACK_TOKEN=<your_token>
SLACK_SIGNING_SECRET=<your_signing_secret>
SLACK_BASE_URL=https://slack.com/api
SLACK_CHANNEL=your-channel
PORT=3000
```

## How to run

### Clone repository
```console
git clone https://github.com/leragogogo/notifications_import.git
cd notifications_import
```

### Install dependencies
```console
npm install
```

### Start the service
```console
npm run dev
```
