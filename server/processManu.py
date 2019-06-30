import numpy as np
import matplotlib.pyplot as plt
import json
from sklearn.cluster import KMeans

name1 = 'normal'
name2 = 'chain'

data1 = json.load(open('../data/5piece/manu_' + name1 + '.json'))
data2 = json.load(open('../data/5piece/manu_' + name2 + '.json'))

data1 = np.array(data1)
data2 = np.array(data2)

infoData1 = {}

labels = [0 for i in range(2000)]
for label, value in enumerate(data1):
    for index in value:
        labels[index] = label

infoData1['labels'] = labels
percence = [0, 0, 0, 0, 0]
for label in labels:
    percence[label] += 1

# infoData1['percentage'] = percence
infoData1['percentage'] = [i/20.0 for i in percence]

trans = [[0 for i in range(5)] for j in range(5)]

for i in range (len(infoData1['labels']) -1):
    trans[infoData1['labels'][i]][infoData1['labels'][i+1]] += 1

# infoData1['trans'] = [[value * 100 /percence[i] for value in trans[i]] for i in range(4)]
infoData1['trans'] = [["%.2f" % (value * 100.0 /percence[i]) for value in trans[i]] for i in range(5)]

with open('../data/5piece/cluster1_' + name1 + '.json', 'w') as outfile:
    json.dump(infoData1, outfile)

infoData2 = {}
labels = [0 for i in range(2000)]
for label, value in enumerate(data2):
    for index in value:
        if index < 2000:
            labels[index] = label
infoData2['labels'] = labels

percence = [0, 0, 0, 0, 0, 0]
for label in labels:
    percence[label] += 1

infoData2['percentage'] = [i/20.0 for i in percence]

trans = [[0 for i in range(6)] for j in range(6)]

for i in range (len(infoData2['labels']) -1):
    trans[infoData2['labels'][i]][infoData2['labels'][i+1]] += 1

# infoData2['trans'] = trans
infoData2['trans'] = [["%.2f" % (value * 100.0 /percence[i]) for value in trans[i]] for i in range(6)]
#  print(infoData2['trans'])
# print(trans)
with open('../data/5piece/cluster1_' + name2 + '.json', 'w') as outfile:
    json.dump(infoData2, outfile)
