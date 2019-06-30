import numpy as np
import matplotlib.pyplot as plt
import json
from sklearn.cluster import KMeans

name1 = 'normal'
name2 = 'chain'

data1 = json.load(open('../data/5piece/pca_' + name1 + '.json'))
data2 = json.load(open('../data/5piece/pca_' + name2 + '.json'))

data1 = np.array(data1)
data2 = np.array(data2)

# f1 = plt.figure(1)
# plt.scatter(data1[:,0], data1[:,1])
# plt.scatter(data2[:,0], data2[:,1], c='red')
# plt.show()
# exit()

infoData1 = {}
clf = KMeans(n_clusters=4)
s = clf.fit(data1)
infoData1['labels'] = clf.labels_.tolist()
infoData1['centers'] = clf.cluster_centers_.tolist()

percence = [0, 0, 0, 0]
for label in clf.labels_:
    percence[label] += 1

#  mark = ['or', 'ob', 'og', 'ok', '^r', '+r', 'sr', 'dr', '<r', 'pr']

# f1 = plt.figure(1)
# for i in xrange(2000): #markIndex = int(clusterAssment[i, 0])
    # plt.plot(data1[i][0], data1[i][1], mark[clf.labels_[i]])
    # #  plt.plot(data2[i][0], data2[i][1], mark[clf.labels_[i]])
# plt.show()
# exit()
# centroids = clf.cluster_centers_
# for i in range(4):
    # plt.plot(centroids[i][0], centroids[i][1], mark[i], markersize = 12)
# f1 = plt.figure(1)
# plt.scatter(data1[:,0], data1[:,1])
# plt.scatter(data2[:,0], data2[:,1], c='red')
# plt.show()
# exit()


# infoData1['percentage'] = percence
infoData1['percentage'] = [i/20.0 for i in percence]

trans = [[0 for i in range(4)] for j in range(4)]

for i in range (len(infoData1['labels']) -1):
    trans[infoData1['labels'][i]][infoData1['labels'][i+1]] += 1

# infoData1['trans'] = [[value * 100 /percence[i] for value in trans[i]] for i in range(4)]
infoData1['trans'] = [["%.2f" % (value * 100.0 /percence[i]) for value in trans[i]] for i in range(4)]

print(infoData1)
with open('../data/5piece/cluster_' + name1 + '.json', 'w') as outfile:
    json.dump(infoData1, outfile)

infoData2 = {}
clf = KMeans(n_clusters=4)
s = clf.fit(data2)
infoData2['labels'] = clf.labels_.tolist()
infoData2['centers'] = clf.cluster_centers_.tolist()

percence = [0, 0, 0, 0]
for label in clf.labels_:
    percence[label] += 1

infoData2['percentage'] = [i/20.0 for i in percence]

trans = [[0 for i in range(4)] for j in range(4)]

for i in range (len(infoData2['labels']) -1):
    trans[infoData2['labels'][i]][infoData2['labels'][i+1]] += 1

# infoData2['trans'] = trans
infoData2['trans'] = [["%.2f" % (value * 100.0 /percence[i]) for value in trans[i]] for i in range(4)]
print(infoData2['trans'])
# print(trans)
with open('../data/5piece/cluster_' + name2 + '.json', 'w') as outfile:
    json.dump(infoData2, outfile)
