# -*- coding: utf-8 -*-
import csv
import numpy as np
import json

def readCsv(filename):
    file = open('../data/5piece/' + filename + '.csv', 'rt')
    dataReader = csv.reader(file)
    data = [e for e in dataReader]
    file.close()
    return np.array(data)

data1 = readCsv('null_chain')
data1 = data1[1:, 1:7]

data1 = [[float(i) for i in j] for j in data1]
data1 = [item[:3] + item[4:] for item in data1]
#  data1 = np.array(data1)
#  print(data1)
#  exit()

with open('../data/5piece/chain.json', 'w') as outfile:
    json.dump(data1, outfile)

data2 = readCsv('5piecesnormal')
data2 = [[float(i) for i in j] for j in data2]

with open('../data/5piece/normal.json', 'w') as outfile:
    json.dump(data2, outfile)
