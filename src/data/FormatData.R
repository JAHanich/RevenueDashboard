install.packages("readr")
install.packages("tidyverse")
install.packages("writexl")
library(readr)
library(dplyr)
library(tidyr)
library(stringr)

#We set up the function that will clean and standardise all of the datasets

cleanData <- function(url) {
    dataTableOne <- read_csv(url, col_names = FALSE) %>% #Load data
        t() %>%
        as.data.frame() %>%
        fill(c("V1", "V2"), .direction = "down") %>% #Fill years and dates 
        t() %>% #We transpose to take advantage of the fill function that only works columnwise
        as.data.frame() %>%
        rename(NomAbrege = X1, Nom = X2, Numero = X3) %>%
        select(NomAbrege, Nom, Numero, where(~ !is.na(.x[3]) && .x[3] == "MONTANT_LIGNE_NET_HT" && !str_detect(.x[1], "Total")))

    new_cols <- dataTableOne[1:2, 4:ncol(dataTableOne)] %>%
        summarise(across(everything(), ~ paste(.[1], .[2], sep = "-"))) %>%
        as.character()

    dataTableOne <- dataTableOne %>%
        slice(-c(1:3, length(dataTableOne[, 1]))) %>%
        setNames(c("NomAbrege", "Nom", "Numero", new_cols)) %>%
        mutate(across(-c(NomAbrege, Nom, Numero), ~ str_remove_all(., "'"))) %>%
        mutate(across(-c(NomAbrege, Nom, Numero), as.numeric))    
    return(dataTableOne)
}

cleanDataTableOne <- cleanData("public/data/2002-2005_FacturesClientMois.csv")
cleanDataTableTwo <- cleanData("public/data/2006-2010_FacturesClientMois.csv")
cleanDataTableThree <- cleanData("public/data/2011-2015_FacturesClientMois.csv")
cleanDataTableFour <- cleanData("public/data/2016-2020_FacturesClientMois.csv")
cleanDataTableFive <- cleanData("public/data/2021_FacturesClientMois.csv")
cleanDataTableSix <- cleanData("public/data/2026-2022_FacturesClientMois.csv")

#In what follows, we take advantage of the pivot functions
#to merge our data tables into one with respect to the first 
#three rows.

t1_long <- cleanDataTableOne %>%
  pivot_longer(
    cols = -c("NomAbrege", "Nom", "Numero"),
    names_to  = "date",
    values_to = "value"
  )

View(t1_long)

t2_long <- cleanDataTableTwo %>%
  pivot_longer(
    cols = -c("NomAbrege", "Nom", "Numero"),
    names_to  = "date",
    values_to = "value"
  )

t3_long <- cleanDataTableThree %>%
  pivot_longer(
    cols = -c("NomAbrege", "Nom", "Numero"),
    names_to  = "date",
    values_to = "value"
  )

t4_long <- cleanDataTableFour %>%
  pivot_longer(
    cols = -c("NomAbrege", "Nom", "Numero"),
    names_to  = "date",
    values_to = "value"
  )

t5_long <- cleanDataTableFive %>%
  pivot_longer(
    cols = -c("NomAbrege", "Nom", "Numero"),
    names_to  = "date",
    values_to = "value"
  )

t6_long <- cleanDataTableSix %>%
  pivot_longer(
    cols = -c("NomAbrege", "Nom", "Numero"),
    names_to  = "date",
    values_to = "value"
  )


all_data <- bind_rows(
  t1_long,
  t2_long,
  t3_long,
  t4_long,
  t5_long,
  t6_long
)

all_data <- all_data[!(is.na(all_data$Numero)), ] #Delete rows without number (totals)

final <- all_data %>%
  pivot_wider(
    names_from  = date,
    values_from = value,
  )

cols <- 4:ncol(final)

final <- final[!apply(final[, cols], 1, function(x)
  all(is.na(x) | x == 0 | x == "")
), ] #Delete all rows that are filled with only 0, "", or NA

View(final)

#Treating duplicates 


coalesceRows <- function(row1, row2) {
  stopifnot(length(row1) == length(row2))  # rows must be same length
  result <- vector("list", length(row1))  # list preserves types
  for (i in seq_along(row1)) {
    if (!is.na(row1[[i]])) {
      result[[i]] <- row1[[i]]
    } else {
      result[[i]] <- row2[[i]]
    }
  }
  # Return as the same type of object as input
  if (is.data.frame(row1)) {
    return(as.data.frame(result, stringsAsFactors = FALSE))
  } else {
    return(unlist(result))
  }
}

#Coalesce duplicated rows

row1 <- final[7, , drop = FALSE]  # drop=FALSE keeps it as data frame
row2 <- final[473, , drop = FALSE]

final[7, ] <- coalesceRows(row1, row2)
final <- final[-473, ]

row1 <- final[145, , drop = FALSE]  # drop=FALSE keeps it as data frame
row2 <- final[481, , drop = FALSE]

final[145, ] <- coalesceRows(row1, row2)
final <- final[-481, ]

row1 <- final[340, , drop = FALSE]  # drop=FALSE keeps it as data frame
row2 <- final[544, , drop = FALSE]

final[340, ] <- coalesceRows(row1, row2)
final <- final[-544, ]

#Format to make it compatible with loadRevenueData.ts file

final <- final %>%
mutate(customer = paste(Numero, Nom, sep=" - ")) %>%
relocate(customer, .before = 1) %>%
select(-c(NomAbrege, Nom, Numero)) %>%
arrange(customer) %>%
write_csv("public/data/revenueFull.csv", na = "")

library(writexl)
write_xlsx(final, "public/data/revenue.xlsx")

