---
layout: post
title: "Web Scraping with R & Amazon Web Services"
subtitle: "A Case Study in Collecting FAA Temporary Flight Restriction (TFR) Data"
date: 2017-10-10
category: data
nav_section: data
body_class: article
toc: true
summary: "Setting up an R-based web scraper on an AWS EC2 instance"
links:
  - text: GitHub
    url: https://github.com/michaelkotrous/tfr-data
languages:
  - R
  - Shell
image_credits:
  - text: "Cover: Andy Stadler"
    url: "http://xcski.com/~ptomblin/planes.txt"
---

<div class="article-hero">
<div class="ascii-art"><pre>

                    |
                    |
______________________________|_______________________________
                ----\--||___||--/----
                     \ :==e==: /
                      \|  o  |/
                       \_____/
                       /  |  \
                     e/   e   \e
                     U    U    U
</pre></div>
</div>

## Introduction

R's XML package is a powerful tool for generating datasets by "scraping" the text of HTML and XML documents. Converting webpage data into a dataframe you can work with in R is very simple for websites that format their data cleanly using HTML tables.

```r
tables <- readHTMLTable(url)
table  <- tables[[n]]
```

The `readHTMLTable` function turns all HTML tables found at the given URL into separate dataframes in R, so you have to comb through the output to determine which table you wish to use for analysis (in the example above, `table` is set as the nth table scraped from the webpage).

This is quite convenient for cases where the data of interest is unchanging, updated infrequently, or future updates don't matter for the analysis you plan to run. Simply running the scrape once on your desktop suffices to gather the data you want. Consider these examples:

- Individual medalist and country medal [counts](https://www.sports-reference.com/olympics/summer/2000/) for the 2000 Sydney Olympic Games.
- Wins-above-replacement (WAR) leader in the AL and NL each year between 1917 and 2016. ([Baseball Reference](https://www.baseball-reference.com/leaders/WAR_bat_leagues.shtml))
- All-time movie box office rankings, gross receipts adjusted for inflation. ([Box Office Mojo](http://www.boxofficemojo.com/alltime/adjusted.htm))
- Weekly Apple stock prices between Jan. 1, 2005 and Dec. 31, 2012. ([Yahoo Finance](https://finance.yahoo.com/quote/AAPL/history?period1=1104555600&period2=1356930000&interval=1wk&filter=history&frequency=1wk))

However, a more robust web scraping solution is needed when the data is updated regularly, and we would like to capture all these updates. Consider two such cases that I've encountered:

- Updating daily data on home runs hit in MLB games during the ongoing season. ([ESPN Home Run Tracker](http://www.hittrackeronline.com/index.php))
- Aggregating data on all temporary flight restrictions (TFRs) issued by the FAA. ([FAA](http://tfr.faa.gov/tfr2/list.jsp))

Updating the dataset manually is unrealistic, unreliable, and time-consuming, so we need to operate the web scraping scripts in an environment such that:

1. the device has a persistent Internet connection, and
2. the device can execute the web scrape and other functions automatically at specified intervals, or frequency.

The specific problem I took on was running an hourly web scrape of the FAA's active TFR list. The R and Shell code I run to execute these scrapes is available in a [GitHub repo](https://github.com/michaelkotrous/tfr-data).

The hosting solution I found was using Amazon Web Service's Elastic Cloud Computing (EC2) service. Under the [AWS free tier](https://aws.amazon.com/free/), I can run an EC2 Linux instance configured to run the web scrapes in R each hour and kick the output data to an AWS S3 bucket. All this can be done for free, or at very minimal cost.

If you have not set up an AWS account, you can create one and be eligible to take advantage of the AWS free tier for 12 months!

The rest of this post outlines the process of setting up the EC2 instance with R and the dependencies you will need to run the code in my `tfr-data` GitHub repo, or a web scraper of your own!

## Create an AWS Cloud Computing (EC2) Instance

In AWS EC2 console interface, you will walk through creating an EC2 instance. Here are my notes, numbered in correspondence with the steps of the interface.

1. Amazon Linux, free tier eligible. R is very easy to install and configure in Linux. If you have any experience with Linux or Mac OS Terminal, then you'll feel at home in this setup.
2. The `t2.micro` instance is the only one that is free-tier eligible. Unless you're running a scrape that will be processing gigabytes upon gigabytes of data, this should be adequate.
3. Select IAM role. This will be necessary if you wish to set up a user that can read and write your data output to an S3 bucket. If you do wish to integrate S3 (recommended), please skip down to the S3 setup section below to set this up right.
4. There's probably no need to add more storage to your instance, and I'm not sure how any changes will affect your free-tier eligibility.
5. Create tags as you see fit.
6. The security group controls the traffic that can navigate to your EC2 instance, which I expand on directly below.

### Security Group

These settings will vary greatly across users, depending on if they are hosting a web application, or using a Linux instance to compile data like I have. This [AWS blog post](https://aws.amazon.com/blogs/big-data/running-r-on-aws/) discusses using RStudio and Shiny to create data visualizations that are accessible via web browser, so that's good reference for setting up your security group if you wish to go that route.

In my case, I only allow traffic via SSH, with the IP address set to that of my personal device. If you need to access the EC2 instance from multiple devices or locations (home and office), simply create new rules of type SSH to allow multiple IP addresses to connect.

### Private-Public Key Pair ([AWS Doc](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html))

Before you launch your EC2 instance, you will have generated a private-public key pair that you will be required to have when connecting to your EC2 instance (it will be downloaded with the `.pem` extension). With the key in hand, you connect to your launched EC2 instance like so:

```bash
$ ssh -i /path/my-key-pair.pem ec2-user@public-dns-IPv4
```

The `-i` option specifies the path to the `.pem` key-pair file, which is necessary to verify your authority to access the server. The IPv4 public DNS can be copied-and-pasted from the EC2 console.

Once connected, you'll see the following in your Terminal window:

```
   __|  __|_  )
   _|  (     /   Amazon Linux AMI
  ___|\___|___|
```

### Installing R and Other Dependencies

Now that the instance is launched and configured, the next step is to install dependencies not preloaded onto the server. The technologies on which the XML package depends for its web scraping capabilities are usually preconfigured on Mac and Windows devices, but we're not so lucky with the Linux AMI.

```bash
$ sudo yum install -y libcurl-devel
$ sudo yum install -y openssl-devel
$ sudo yum install -y libxml2-devel
$ sudo yum install -y R
```

Henceforth, simply typing the command `R` will launch the R application, and the interface in your Terminal window will be very familiar to that of your desktop application. The same commands work, and you can write your R script just like you would in your Mac or Windows desktop environment.

You'll need to install the XML, RCurl, and httr R packages manually, which are required for my [FAA TFR scrapes](https://github.com/michaelkotrous/tfr-data) and will likely be needed for yours.

```r
chooseCRANmirror()
# select mirror with integer response
install.packages("XML",   dependencies=TRUE)
install.packages("RCurl", dependencies=TRUE)
install.packages("httr",  dependencies=TRUE)
```

At the end of the install process for `httr`, you'll see warning messages about `jpeg`, `png`, `readr`, and `xml2`. These can be disregarded for my use case, so I expect you won't need to install those libraries to run your web scraping tool either.

Now you can upload files, like your R code, to the server using `scp` (secure copy).

```bash
$ scp -i /path/my-key-pair.pem /path/to/file.R ec2-user@public-dns-IPv4:~
```

Finally, to automate the script to run each hour, add a cron task with `crontab -e`. You may need to add `sudo` before `R` to prevent errors.

```bash
MAILTO=email
0 * * * * R CMD BATCH /home/ec2-user/file.R
```

The script will run the R file every hour, and print the output in an email. The emails can be annoying, but it makes for an excellent debugging tool in case unexpected issues arise within the first few days of the script running. Setting a filter to move these hourly updates to a folder lessens the annoyance considerably. Simply remove the `MAILTO` line to stop the emails.

## Create an S3 Bucket to Store and Publicly List Your Data

S3 is AWS's "Simple Storage Service." It too is free-tier eligible, and it is incredibly affordable after the limited-time offer expires. Using S3 has an advantage over storing the data on your EC2 instance.

1. **Redundancy:** Copying the data you've compiled to S3 will protect you in the event that the EC2 instance you've created is shut down and access to its files is lost.
2. **Security:** You want to limit access to your EC2 instance as much as possible. Depending on your security group settings, you may only be able to connect to your server by secure shell if and only if you hold the corresponding private-public key pair and your IP address has been allowed under the security group settings. Opening up the EC2 to allow anonymous users to access your dataset greatly increases your attack surface for those who may want to get access to other items or take control of your EC2 instance.
3. **Transparency:** Rather than relying on you to hand over your data, reviewers, colleagues, and readers can go download the latest copy of your dataset themselves from your S3 bucket, if they would like to run new tests or attempt to replicate your results.

### Connecting EC2 and S3 with an IAM Role

When assigning an IAM role for your EC2 instance, you want to have a role that can read and write data to the S3 bucket which you will use to store your data. You can accomplish this by assigning the `AmazonS3FullAccess` policy to that user, but this policy allows the role to read and write to any S3 bucket under your AWS account.

A cleaner and less-risky policy can be created custom by lightly editing the JSON code below to match your new role's desired settings. This code allows the user to list the content of `your-bucket` and add, edit, and delete items in `your-bucket` specifically.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["s3:ListBucket"],
            "Resource": ["arn:aws:s3:::your-bucket"]
        },
        {
            "Effect": "Allow",
            "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
            "Resource": ["arn:aws:s3:::your-bucket/*"]
        }
    ]
}
```

Once the role is correctly configured, you just need to check that this role is assigned to your EC2 instance under IAM role.

You can now use the AWS command line tools (preinstalled on the Linux AMI) to sync the files on your EC2 instance with those in your S3 bucket. You can add this to the front and end of your cron task to automate the syncs between S3 and EC2.

```bash
0 * * * * aws s3 sync s3://your-bucket /home/ec2-user/s3-export && R CMD BATCH /home/ec2-user/file.R && aws s3 sync /home/ec2-user/s3-export s3://your-bucket
```

The first S3 sync takes all the folders and files in `your-bucket` and updates the files local to your EC2 instance at the specified path. The second S3 sync updates the files in your bucket to match the data on your EC2 instance, which should be updated to reflect the most recent run of the web scraping script.

The purpose of the `&&` in the cron file is to set the order of the functions run. It also stops the process if at any point one of the functions throws a fatal error.

### Make Your Data Public

In the S3 Management Console, you can customize the permissions of your bucket to allow anyone to read the files (or specific files) in your bucket under the "Permissions" tab in the bucket's settings. It's important that we only give anonymous users read access to the bucket.

The default read-only access you can give to everyone under "Access Control List" allows anyone to list the contents of your bucket by navigating to the base URL. This may be problematic, so you can set custom permissions under "Bucket Policy" that allow anyone to read or download the files of your choosing without exposing all the files in your bucket to the public eye.

```json
{
    "Version": "2008-10-17",
    "Id": "http better policy",
    "Statement": [
        {
            "Sid": "readonly policy",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket/*"
        }
    ]
}
```

`Principal: *` means anyone. Note that you can change `Resource` to assign a specific file path or paths. By this current configuration, anyone can read any file in `your-bucket`, but cannot list all the contents of `your-bucket`. Bucket policies can be easily debugged by plugging URLs to your bucket into your browser to see if the desired results are achieved.
