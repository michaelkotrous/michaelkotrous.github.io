---
layout: post
title: "Downloading FAA TFR Data"
date: 2021-12-26
category: data
nav_section: data
body_class: article
summary: "Download the TFR dataset and shapefiles collected by my FAA web scraper"
links:
  - text: GitHub
    url: https://github.com/michaelkotrous/tfr-data
  - text: "Download TFR Data (.csv)"
    url: https://faa-tfr-datasnap.s3.us-east-2.amazonaws.com/tfrData-export-memory.2021.12.22.21UTC-6.csv
  - text: "Download Shapefiles (.tar.gz)"
    url: https://faa-tfr-datasnap.s3.us-east-2.amazonaws.com/shapefiles.2021.12.22.21UTC-6.tar.gz
languages:
  - R
  - Shell
---

I have made available a dataset of temporary flight restrictions (TFRs) issued by the Federal Aviation Administration (FAA). In all, I collected the text of 15,558 TFRs that were active between September 20, 2017 and December 21, 2021. You can also download the shapefiles for all TFRs, which can be loaded into GIS software.

- [Download TFR Data (.csv)](https://faa-tfr-datasnap.s3.us-east-2.amazonaws.com/tfrData-export-memory.2021.12.22.21UTC-6.csv)
- [Download Shapefiles (.tar.gz)](https://faa-tfr-datasnap.s3.us-east-2.amazonaws.com/shapefiles.2021.12.22.21UTC-6.tar.gz)

A directory of shapefiles in the .tar.gz archive can be paired with its corresponding TFR by matching the folder name with the `guid` column of the csv file. For more details, please see the [GitHub project](https://github.com/michaelkotrous/tfr-data) or the [tutorial post](/post/web-scraping-with-r-amazon-web-services) documenting how I built the web scraping tool with R and AWS EC2.
