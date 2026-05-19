---
layout: post
title: "Downloading FAA TFR Data"
date: 2021-12-26
category: data
nav_section: data
body_class: article
---

I have made available a dataset of temporary flight restrictions (TFRs) issued by the Federal Aviation Administration (FAA). In all, I collected the text of 15,558 TFRs that were active between September 20, 2017 and December 21, 2021. You can also download the shapefiles for all TFRs, which can be loaded into GIS software.

- [Download TFR Data (.csv)](https://www.dropbox.com/scl/fi/pq1ks134ojh1fpzimiey2/tfrData-export-memory.2021.12.22.21UTC-6.csv?rlkey=sjfb3m31wnfezam43ylcz8847&st=rrrv2p77&dl=0){:target="_blank"}
- [Download Shapefiles (.tar.gz)](https://www.dropbox.com/scl/fi/1zmgvkuypgphsx4wduan5/shapefiles.2021.12.22.21UTC-6.tar.gz?rlkey=7k2itjkisraln4qco5w1ws8xp&st=b23w5hpj&dl=0){:target="_blank"}

A directory of shapefiles in the .tar.gz archive can be paired with its corresponding TFR by matching the folder name with the `guid` column of the csv file. For more details, please see the [GitHub project](https://github.com/michaelkotrous/tfr-data){:target="_blank"} or the [tutorial post](/post/web-scraping-with-r-amazon-web-services) documenting how I built the web scraping tool with R and AWS EC2.
