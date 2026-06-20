const { connect } = require("puppeteer-real-browser")
const fs = require("fs")
const { resolve } = require("dns")
const { get } = require("http")

class WorkingUpworkScraper_NoCookie {
    constructor(){
        this.browser = null
        this.page = null
    }

    async init(cookieData = null){
        console.log("Initializing Browser...")
        try {
            const { browser, page } = await connect({
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu"
                ],
                fingerprint: true,
                turnstile: true,
                connectOption: {
                    defaultViewport: null,
                },
            });
            
            this.browser = browser
            this.page = page

            if (cookieData?.length){
                console.log("Attempting to load previous cookies..")
                try{
                    await this.page.setCookie(...cookieData)
                    console.log("Cookie loaded successfully")
                }
                catch (error){
                    console.error("Failed to load or set cookie")
                }
            }    
            await this.page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
            )

            console.log("Browser Initialized")
            return true    
            
        }
        catch(error){
            console.error("Failed to initialize browser: ", error.message)
            return false
        }
    }

    async navigateToUpwork(targetUrl) {
        console.log(`Navigating to ${targetUrl}... `)
        try {
            await this.page.goto(targetUrl, {
                waitUntil: "networkidle0",
                timeout: 60000,
            })

            await this.waitForCloudflareComplete()
            await this.delay(3000, 5000)
            
            console.log("Successfully reached the target URL..")
            return true
        }
        catch (error) {
            console.error("Navigation failed: ", error.message)
            return false
        }
    }

    async delay(min = 2000, max = 4000) {
        const delay = Math.random() * (max-min) + min
        console.log(`Waiting ${Math.round(delay/1000)}s...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
    }

    async waitForCloudflareComplete() {
        console.log("Waiting for cloudflare to complete...")
        let attempts = 0
        const maxAttempts = 20
        while (attempts < maxAttempts) {
            attempts++
            const title = await this.page.title()
            const url = await this.page.url()
            console.log(`Attempts ${attempts}/${maxAttempts} - ${title}`)
            if (
                url.includes("upwork.com") && 
                !title.toLowerCase().includes("cloudflare") &&
                !title.toLowerCase().includes("checking")
            ) {
                console.log("Cloudflare completely bypassed")
                return true
            }
            await this.delay(5000, 8000)
        }
        console.log("Continuing despite Cloudflare...")
        return true
    }

    async findJobElements() {
    const selector = 'section[data-qa="job-tile"]';

    await this.page.waitForSelector(selector, {
        timeout: 10000,
    });

    const elements = await this.page.$$(selector);

    console.log(`Found ${elements.length} jobs`);

    return {
        elements,
        selector,
    };
    }

    async scrapeJobs(maxJobs = 20) {
        console.log("Starting Job Scraping")
        const jobs = []

        try {
            const { elements: jobElements } = await this.findJobElements()

            if (jobElements.length === 0) {
                console.log("No job elements found")
                return jobs
            }

            const maxJobsToProcess = Math.min(jobElements.length, maxJobs)
            
            for (let i = 0; i < maxJobsToProcess; i++) {
                try {
                    const jobData = await jobElements[i].evaluate((element) => {
                        const getText = (selector) => 
                            element.querySelector(selector)?.textContent.trim() || "No Text"
                        console.log(getText(".job-title"))
                        const job_id = element.getAttribute("data-ev-job-uid") || null

                        const titleLink =
                            element.querySelector('a[data-qa="job-title"]');
                        const title = titleLink?.textContent.trim() || "No Title"
                        const url = titleLink?.href || "No URL"

                        const description =
                            element.querySelector(
                                'p[data-qa="job-description"]'
                            )?.innerText || "";

                        const budget =
                            element.querySelector(
                                '.icon-content-grid strong'
                            )?.innerText || "";
                        const experienceLevel =
                            element.querySelector(
                                '[data-qa="expert-level"] strong[data-qa="value"]'
                            )?.innerText || "";

                        const jobInfoItems = element.querySelectorAll(
                            '[data-test="JobInfo"] li, .job-title-info-list li'
                        )

                        jobInfoItems.forEach((item) => {
                            const text = item.textContent.trim()
                            if (text.includes("Hourly") || text.includes("Fixed-price"))
                                budget = text
                            if (
                                text.includes("Entry") ||
                                text.includes("Intermediate") ||
                                text.includes("Expert")
                            )
                                experienceLevel = text
                        })

                        const posted =
                            element.querySelectorAll(
                                '.text-muted-on-inverse'
                            )[1]?.innerText || "";

                        const skills = Array.from(
                            element.querySelectorAll(".skills-list span")
                        ).map(e => e.innerText);

                        const paymentVerified = getText(
                            '[data-text="payment-verification-badge"]'
                        )?.includes("Payment Verified")
                            ? "Verified"
                            : "Unverified"
                        const rating = getText(".air3-rating-value-text")
                            ? `${getText(".air3-rating-value-text")} Stars`
                            : "No Rating"
                        const totalSpent = getText('[data-test="total-spent"] strong')
                            ? `${getText('[data-test="total-spent"] strong')} spent`
                            : "No Spend"
                        const location = getText('[data-test="location"]') || "No Location"
                        const clientInfo = `${paymentVerified} | ${rating} | ${totalSpent} | ${location}`

                        return {
                            job_id,
                            title,
                            description,
                            budget,
                            experienceLevel,
                            posted,
                            skills,
                            clientInfo,
                            url,
                        }
                    })

                    if (jobData && jobData.title !== "No Title") {
                        jobs.push({
                            id: jobs.length + 1,
                            ...jobData,
                            scrapedAt: new Date().toISOString()
                        })
                        console.log(
                            `Job ${jobs.length}: [${
                                jobData.job_id
                            }] ${jobData.title.substring(0, 40)}...`
                        )
                    }
                    else {
                        console.log(`Skipped Job ${i + 1} - no valid data found`)
                    }
                    await this.delay(200, 500)
                } 
                catch (error) {
                    console.log(`Error processing job ${i+1}:`, error.message)
                }
            }
        }
        catch (error) {
            console.error("Scrapping Error:", error.message)
        }
        return jobs
    }

    async close() {
        try {
            if (this.browser) {
                await this.browser.close()
                console.log("Browser Closed")
            }
        }
        catch (error) {
            console.log("Error closing browser: ", error.message)
        }
    }
}

module.exports = WorkingUpworkScraper_NoCookie;