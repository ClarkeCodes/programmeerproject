#!/usr/bin/env python
import sys
sys.dont_write_bytecode = True
import csv


def main():

    path = sys.argv[1]
    f = open(path)
    csv_f = csv.reader(f)

    countries = []
    age_groups = []
    values = []

    header = ['country', '10 to 14', '15 to 19', '20 to 24', '25 to 29', '30 to 34',
    '35 to 39', '40 to 44', '45 to 49', '50 to 54', '55 to 59', '60 to 64',
    '65 to 69', '70 to 74','75 to 79', '80 plus', 'All Ages']

    for row in csv_f:
        countries.append(row[0])
        age_groups.append(row[1])
        values.append(row[2])
    countries = set(countries)
    age_groups = set(age_groups)


    sorted_countries = list(countries)
    sorted_countries.sort()

    number1 = 0
    number2 = 15

    newValues = []
    for i in range(0, 195):
        # print number1, number2
        new = values[number1:number2 + 1]
        new.insert(0, sorted_countries[i])
        print i, sorted_countries[i], values[number1], values[number2]
        newValues.append(new)
        number1 += 16
        number2 += 16


    newFile = open('depression_female_2015.csv', 'wb')
    writer = csv.writer(newFile)
    writer.writerow(header)
    for country in newValues:
        writer.writerow(country)


if __name__ == "__main__":
    main()
