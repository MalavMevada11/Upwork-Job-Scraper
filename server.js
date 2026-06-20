const fs = require("fs")

const express = require("express")
const WorkingUpworkScraper_NoCookie = require("./scraper")
const { error } = require("console")

const app = express()

app.use(express.json({ limit: "5mb" }))

const port = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.status(200).json({message: "Upwork Scrapper API is running."})
})

app.post("/scrape", async (req, res) => {
    const { url, cookies } = req.body

    if (!url) {
        return res.status(400).json({ error: "Upwork Search URL is required" })
    }

    console.log(`Recieved scrape request for URL: ${url}`)

    const scraper = new WorkingUpworkScraper_NoCookie()

    try {
        const initSuccess = await scraper.init(cookies)
        if (!initSuccess) {
            throw new Error("Failed to initialize scraping browser")
        }

        const navSuccess = await scraper.navigateToUpwork(url)
        if (!navSuccess) {
            throw new Error(`Failed to navigate to specified URL: ${url}`)
        }

        const jobs = await scraper.scrapeJobs(10)

        console.log(`Scraping successful found ${jobs.length} jobs.`)
        res.status(200).json(jobs)
    }

    catch (error) {
        console.error("Scraping Failed: ", error.message)
        res.status(500).json({
            error: "An internal server error occured during scraping process",
            details: error.message
        })
    }
    finally {
        await scraper.close()
    }
})

app.listen(3000, () => {
    console.log(`Upwork Scrapper API listening on http://localhost:3000`)
})