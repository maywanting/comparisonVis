# -*- coding: utf-8 -*-

import json
import numpy as np
import time
from sklearn.decomposition import PCA

name1 = 'normal'
name2 = 'chain'

data1 = json.load(open('../data/5piece/' + name1 + '.json'))
data2 = json.load(open('../data/5piece/' + name2 + '.json'))

data1 = np.array(data1)
data2 = np.array(data2)

#  print(data1.shape)

data = np.concatenate((data1, data2), axis=0)

after = PCA(n_components=2).fit_transform(data)

maxValue = after.max(axis=0)
minValue = after.min(axis=0)
rangeValue = 700.0 / (maxValue - minValue)
after = (after - minValue) * rangeValue
# print(after.max(axis=0))
after1 = after[:2000]
# print(after1.shape)
after2 = after[2000:]
# print(after2.shape)
with open('../data/5piece/pca_' + name1 + '.json', 'w') as outfile:
    json.dump(after1.tolist(), outfile)
with open('../data/5piece/pca_' + name2 + '.json', 'w') as outfile:
    json.dump(after2.tolist(), outfile)
