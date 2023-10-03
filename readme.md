# KRA NIL RETURNER
Every single month, I face the simple but tedious task of having to file tax returns for my registered company
which I don't use. It gets even worse because I have to file PAYE returns yet I have no employees.

I have been doing this since I registered the company in 2018.

Failure to file the nil returns will result in harsh penalties on the company and these could extend to the
company directors.

## Solution
I want to automate the filing of these returns.

Since it is a relatively simple process, I will set up a chron job to run on my laptop once, at the beginning
of every month.

I'll wire it up to send me an email if the process is a success or a failure. Either way, it's important to know.

## What I need
1. Node.js backend - runtime
2. Puppeteer - headless browser
3. Nodemailer - emailer
4. Google Cloud Vision API - bypass the capture

## Things to bear in mind
1. A notification should anything on the website change.
2. A notification in case of failure

>[!Note]
> Still in beta version and details might change