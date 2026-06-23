# Upwork Job Scraper

A Node.js-based scraper that extracts the latest freelancing jobs from Upwork and exposes the results through a simple REST API.

## Features

* Scrapes up to 10 jobs from any Upwork category
* Returns detailed job information:

  * Job Title
  * Budget
  * Duration
  * Experience Level
  * Posted Date
  * Required Skills
  * Apply Link
* Simple REST API interface
* JSON response format
* Easy integration with other applications and workflows

---

## Tech Stack

* Node.js
* Express.js
* Puppeteer

---
## Project Structure

```text
Upwork-Job-Scraper/
├── package.json
├── package-lock.json
├── server.js
├── scraper.js
└── README.md
```

---
## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MalavMevada11/Upwork-Job-Scraper.git
cd Upwork-Job-Scraper
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

```bash
node server.js
```

The server will start on:

```text
http://localhost:3000
```

---

## Getting Upwork Categories

Visit the following page to view available Upwork job categories:

https://www.upwork.com/freelance-jobs/

Copy the URL of the category you want to scrape.

Example:

```text
https://www.upwork.com/freelance-jobs/development-it/
```

---

## API Usage

### Endpoint

```http
POST http://localhost:3000/scrape
```

### Using Postman

#### Step 1: Create a New Request

Open Postman and create a new request.

#### Step 2: Configure the Request

* Method: `POST`
* URL:

```text
http://localhost:3000/scrape
```

#### Step 3: Add Request Body

Navigate to:

```text
Body → Raw → JSON
```

Add the following JSON:

```json
{
  "url": "https://www.upwork.com/freelance-jobs/development-it/"
}
```

Replace the URL with any valid Upwork category URL.

#### Step 4: Send the Request

Click **Send**.

---

## Request Body

| Parameter | Type   | Required | Description                         |
| --------- | ------ | -------- | ----------------------------------- |
| url       | string | Yes      | Valid Upwork category URL to scrape |

Example:

```json
{
  "url": "https://www.upwork.com/freelance-jobs/development-it/"
}
```

---

## Response Format

The API returns an array containing up to 10 job listings.

### Sample Response

```json
[
  {
    "title": "Full Stack Developer",
    "budget": "$500",
    "duration": "1 to 3 months",
    "experienceLevel": "Intermediate",
    "posted": "Posted 2 hours ago",
    "skills": [
      "JavaScript",
      "React",
      "Node.js"
    ],
    "applyLink": "https://www.upwork.com/jobs/example"
  }
]
```

### Response Fields

| Field           | Description                      |
| --------------- | -------------------------------- |
| title           | Job title                        |
| budget          | Project budget                   |
| duration        | Estimated project duration       |
| experienceLevel | Required experience level        |
| posted          | Time since the job was posted    |
| skills          | Required skills for the job      |
| applyLink       | Direct link to apply for the job |

---

## Example Workflow

1. Start the server using:

```bash
node server.js
```

2. Open Postman.

3. Send a POST request to:

```text
http://localhost:3000/scrape
```

4. Add the request body:

```json
{
  "url": "https://www.upwork.com/freelance-jobs/development-it/"
}
```

5. Receive up to 10 job listings in JSON format.

---



## Notes

* The scraper returns a maximum of 10 jobs per request.
* Results depend on the jobs currently available on Upwork.
* Internet connectivity is required.
* Changes to Upwork's website structure may require updates to the scraper.
* Scraping speed may vary depending on network conditions.

---

## Use Cases

This scraper can be used in a variety of automation and job-tracking workflows.

### 1. Job Alert Automation with n8n

Automatically scrape Upwork jobs at scheduled intervals and:

* Send job alerts to Telegram
* Send job notifications via Email
* Post new jobs to Discord channels
* Send opportunities to Slack workspaces

Example Workflow:

```text
Cron Trigger
      ↓
Upwork Job Scraper API
      ↓
Filter Jobs by Skills
      ↓
Telegram / Email / Discord Notification
```

---

### 2. AI-Powered Job Matching

Integrate the scraper with AI models such as OpenAI or Gemini to:

* Analyze job descriptions
* Match jobs against your skills
* Calculate a relevance score
* Recommend the best opportunities

Example:

```text
Scraper API
     ↓
LLM Analysis
     ↓
Skill Matching Score
     ↓
Recommended Jobs
```

---

### 3. Personal Job Dashboard

Store scraped jobs in a database and build a dashboard to:

* Track new opportunities
* Monitor market demand
* Analyze trending skills
* Save favorite jobs

Possible Stack:

* React
* Node.js
* PostgreSQL
* Supabase
* MongoDB

---

### 4. Daily Job Digest

Schedule the scraper to run once every day and generate:

* Daily job summaries
* Top opportunities
* Trending technologies
* Most requested skills

The digest can be delivered through:

* Email
* Telegram
* Slack
* WhatsApp Business API

---

## Author

### Malav Mevada

GitHub:
https://github.com/MalavMevada11

Repository:
https://github.com/MalavMevada11/Upwork-Job-Scraper
