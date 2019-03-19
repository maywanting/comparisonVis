# -*- coding: utf-8 -*-

import json
import numpy as np
import time
from sklearn.manifold import TSNE

name1 = 'normal'
name2 = 'chain'

data1 = json.load(open('../data/5piece/' + name1 + '.json'))
data2 = json.load(open('../data/5piece/' + name2 + '.json'))

data1 = np.array(data1)
data2 = np.array(data2)

#  print(data1.shape)

data = np.concatenate((data1, data2), axis=0)

after = TSNE(n_components=2).fit_transform(data)

print(after.max)
after1 = after[:2000]
# print(after1.shape)
after2 = after[2000:]
# print(after2.shape)
# with open('../data/5piece/tsne_' + name1 + '.json', 'w') as outfile:
    # json.dump(after1.tolist(), outfile)
# with open('../data/5piece/tsne_' + name2 + '.json', 'w') as outfile:
    # json.dump(after2.tolist(), outfile)
