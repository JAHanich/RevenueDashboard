install.packages("readr", "tidyverse")
library(readr)
library(dplyr)
library(tidyr)
library(stringr)

cleanData <- function(url) {
    dataTableOne <- read_csv(url, col_names = FALSE) %>%
        t() %>%
        as.data.frame() %>%
        fill(everything(), .direction = "down") %>%
        t() %>%
        as.data.frame() %>%
        rename(NomAbrege = X1, Nom = X2, Numero = X3) %>%
        select(NomAbrege, Nom, Numero, where(~ !is.na(.x[3]) && .x[3] == "MONTANT_LIGNE_NET_HT" && !str_detect(.x[1], "Total")))

    new_cols <- dataTableOne[1:2, 4:ncol(dataTableOne)] %>%
        summarise(across(everything(), ~ paste(.[1], .[2], sep = "-"))) %>%
        as.character()

    dataTableOne <- dataTableOne %>%
        slice(-c(1, 3)) %>%
        setNames(c("NomAbrege", "Nom", "Numero", new_cols)) %>%
        mutate(across(-c(NomAbrege, Nom, Numero), ~ str_remove_all(., "'"))) %>%
        mutate(across(-c(NomAbrege, Nom, Numero), as.numeric))
    
    return(dataTableOne)
}

cleanDataTableOne <- cleanData("public/data/2002-2005_FacturesClientMois.csv")
cleanDataTableTwo <- cleanData("public/data/2006-2010_FacturesClientMois.csv")
cleanDataTableThree <- cleanData("public/data/2011-2015_FacturesClientMois.csv")
cleanDataTableFour <- cleanData("public/data/2016-2020_FacturesClientMois.csv")
cleanDataTableFive <- cleanData("public/data/2026-2022_FacturesClientMois.csv")

View(cleanDataTableOne)
View(cleanDataTableTwo)
View(cleanDataTableThree)
View(cleanDataTableFour)
View(cleanDataTableFive)



