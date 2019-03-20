const $ = require('jquery');
const d3 = require('d3');
const colormap = require('colormap');
const dagreD3 = require('dagre-d3');

const jsonData = {
    filePath : 'data/5piece/',
    resData : [],
    getData : function(fileName) {
        let file = this.filePath + fileName + '.json';
        return fetch(file).then(response => response.json()).then(jsondata => {
            this.resData = jsondata;
        });
    },
};

const processController = {
    normalData : [], //load origin data of normal
    chainData : [], //load origin data of chain
    normalCluster : [], //load cluster info of normal
    chainCluster : [], //load cluster info of chain
    clusterNum : 0,
    color1: [],
    color2: [],

    dataLoad : async function () {
        await jsonData.getData('pca_normal');
        this.normalData = jsonData.resData;
        // console.log(this.normalData);

        //load origin data of chain
        await jsonData.getData('pca_chain');
        this.chainData = jsonData.resData;
        // console.log(this.chainData);

        //load cluster info of normal
        await jsonData.getData('cluster_normal');
        this.normalCluster = jsonData.resData;
        // console.log(this.normalCluster);

        //load cluster info of chain
        await jsonData.getData('cluster_chain');
        this.chainCluster = jsonData.resData;
        // console.log(this.chainCluster);

        this.clusterNum = this.normalCluster.centers.length;
        //init the colormap
        this.color1 = colormap({
            colormap: 'autumn',
            nshades: this.normalCluster.centers.length,
            format: 'hex',
            alpha: 1
        });
        this.color2 = colormap({
            colormap: 'winter',
            nshades: this.normalCluster.centers.length,
            format: 'hex',
            alpha: 1
        });

    },

    printCluster : function () {
        const width = 800, height = 800;
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);
        const chart = d3.select('#cluster').attr('width', width).attr('height', height);

        chart.selectAll('.circle')
            .data(this.normalData)
            .enter().append('circle')
            .attr('cx', function(d) {
                return d[0]+10;
            })
            .attr('cy', function(d) {
                return d[1]+10;
            })
            .attr('r', 2)
            .style('fill', (d, i) => {
                return this.color1[this.normalCluster.labels[i]];
            });

        chart.selectAll('.circle')
            .data(this.chainData)
            .enter().append('circle')
            .attr('cx', function(d) {
                return d[0]+10;
            })
            .attr('cy', function(d) {
                return d[1]+10;
            })
            .attr('r', 2)
            .style('fill', (d, i) => {
                return this.color2[this.chainCluster.labels[i]];
            });
    },

    printState: function() {
        const g = new dagreD3.graphlib.Graph().setGraph({});
        this.normalCluster.percentage.forEach((value, key) => {
            g.setNode(key, {
                label: value,
                style : "fill: " + this.color1[key],
                shape: "circle"
            });
        });
        let normalNum = this.normalCluster.percentage.length;

        this.chainCluster.percentage.forEach((value, key) => {
            g.setNode(key + normalNum, {
                label: value,
                style : "fill: " + this.color2[key],
                shape: "circle"
            });
        });

        this.normalCluster.trans.forEach((arr, start) => {
            let color = this.color1[start];
            arr.forEach(function(value, end) {
                if (value > 0){
                    g.setEdge(start, end, {
                        label : value,
                        style : "stroke: " + color,
                        arrowheadStyle: "fill: " + color,
                        curve: d3.curveBasis
                    });
                }
            })
        });

        this.chainCluster.trans.forEach((arr, start) => {
            let color = this.color2[start];
            arr.forEach(function(value, end) {
                if (value > 0){
                    g.setEdge(start + normalNum, end + normalNum, {
                        label : value,
                        style : "stroke: " + color,
                        arrowheadStyle: "fill: " + color,
                        curve: d3.curveBasis
                    });
                }
            })
        });
        g.nodes().forEach(function(v) {
            let node = g.node(v);
            node.rx = node.ry = 5;
        });

        let svg = d3.select("#state1"),
            inner = svg.select("g");

        let zoom = d3.zoom().on("zoom", function() {
            inner.attr("transform", d3.event.transform);
        });
        svg.call(zoom);
        let render = new dagreD3.render();
        render(inner, g);

        let initialScale = 0.75;
        svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

        svg.attr('height', g.graph().height * initialScale + 40);
    },

    printTime: function () {
        const width = 1200;
        let number = this.normalCluster.labels.length;
        let gridWidth = width / number;
        const gridHeight = 100 / this.clusterNum;
        const time1 = d3.select('#time1').attr('width', width + 10);

        time1.selectAll('.rect')
            .data(this.normalCluster.labels)
            .enter().append('rect')
            .attr('x', function(d, i) {return i * gridWidth + 10;})
            .attr('y', (d, i) => {
                return this.normalCluster.labels[i] * gridHeight;
            })
            .attr('width', gridWidth)
            .attr('height', gridHeight)
            .style('fill', (d, i) => {
                return this.color1[this.normalCluster.labels[i]];
            });

        const time2 = d3.select('#time2').attr('width', width + 10);

        time2.selectAll('.rect')
            .data(this.chainCluster.labels)
            .enter().append('rect')
            .attr('x', function(d, i) {return i * gridWidth + 10;})
            .attr('y', (d, i)=> {
                return this.chainCluster.labels[i] * gridHeight;
            })
            .attr('width', gridWidth)
            .attr('height', gridHeight)
            .style('fill', (d, i) => {
                return this.color2[this.chainCluster.labels[i]];
            });
        let zoom = d3.zoom().on("zoom", function() {
            inner.attr("transform", d3.event.transform);
        });
    },
    print2D: async function () {
        await jsonData.getData('normal');
        normalOrigin = jsonData.resData;
        await jsonData.getData('chain');
        chainOrigin = jsonData.resData;

        const width = 800, height = 800;
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);
        const chart = d3.select('#detail').attr('width', width).attr('height', height);

        let zoom = 300;
        chart.selectAll('.circle')
            .data(normalOrigin)
            .enter().append('circle')
            .attr('cx', function(d) {
                return d[3] * zoom + 10;
            })
            .attr('cy', function(d) {
                return d[2] * zoom;
            })
            .attr('r', 2)
            .style('fill', (d, i) => {
                return this.color1[this.normalCluster.labels[i]];
            });

        chart.selectAll('.circle')
            .data(chainOrigin)
            .enter().append('circle')
            .attr('cx', function(d) {
                return d[3] * zoom + 10;
            })
            .attr('cy', function(d) {
                return d[2] * zoom;
            })
            .attr('r', 2)
            .style('fill', (d, i) => {
                return this.color2[this.chainCluster.labels[i]];
            });
    },
};

(async function() {
    await processController.dataLoad();
    processController.printCluster();
    processController.printState();
    processController.printTime();
    processController.print2D();
})();
