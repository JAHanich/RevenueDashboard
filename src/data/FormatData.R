install.packages("readr", "tidyverse")
library(readr)
library(dplyr)

dataTableOne <- read_csv("public/data/2002-2005_FacturesClientMois.csv", col_names = FALSE) %>%
    select(where(~ .x[2] == "MONTANT_LIGNE_NET_HT"))
View(dataTableOne)
rownames(dataTableOne)