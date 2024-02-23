const axios = require('axios');
const cheerio = require('cheerio');
const XLSX = require('xlsx');

async function scrapeJobs() {
    const url = 'https://www.linkedin.com/jobs/search?keywords=tech%20job&location=United%20States&geoId=103644278&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0';

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const jobs = [];

        $('.jobs-search__results-list li').each((index, element) => {
            const job = {};

            job.title = $(element).find('.base-search-card__info h3').text().trim();
            job.company = $(element).find('.base-search-card__info h4').text().trim();
            job.location = $(element).find('.job-search-card__location').text().trim();
            job.type = $(element).find('.job-search-card__employment-info').text().trim();
            job.postedDate = $(element).find('.job-search-card__listdate').text().trim();
            job.description = $(element).find('.base-search-card__info').next().text().trim();

            jobs.push(job);
        });

        return jobs;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function saveToExcel(jobs) {
    const worksheet = XLSX.utils.json_to_sheet(jobs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs');
    XLSX.writeFile(workbook, 'jobs.xlsx');
    console.log('Data saved to jobs.xlsx');
}

async function main() {
    const jobs = await scrapeJobs();
    saveToExcel(jobs);
}

main();
