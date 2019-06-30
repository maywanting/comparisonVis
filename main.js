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
    normalNum : 0,
    chainNum : 0,
    color1: [],
    color2: [],

    dataLoad : async function () {
        await jsonData.getData('tsne_normal');
        this.normalData = jsonData.resData;
        // console.log(this.normalData);

        //load origin data of chain
        await jsonData.getData('tsne_chain');
        this.chainData = jsonData.resData;
        // console.log(this.chainData);

        //load cluster info of normal
        await jsonData.getData('cluster1_normal');
        this.normalCluster = jsonData.resData;
        // console.log(this.normalCluster);

        //load cluster info of chain
        await jsonData.getData('cluster1_chain');
        this.chainCluster = jsonData.resData;
        // console.log(this.chainCluster);

        this.normalNum= this.normalCluster.percentage.length;
        this.chainNum= this.chainCluster.percentage.length;
        //init the colormap
        this.color1 = colormap({
            colormap: 'autumn',
            nshades: this.normalCluster.percentage.length,
            format: 'hex',
            alpha: 1
        });
        console.log(this.color1);
        this.color2 = colormap({
            colormap: 'winter',
            nshades: this.chainCluster.percentage.length,
            format: 'hex',
            alpha: 1
        });
        console.log(this.color2);

    },

    printCluster : function () {
        let theto = 1;
        const width = 800, height = 700;
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);
        const svg = d3.select('#cluster').attr('width', width).attr('height', height);
        let line = d3.line()
            .x(d => d[0]/theto + 10)
            .y(d => d[1]/theto + 10);
        svg.append("path")
            .datum(this.normalData)
            .attr("fill", "none")
            .attr("opacity", "0.3")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 0.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);
        svg.selectAll('.circle')
            .data(this.normalData)
            .enter().append('circle')
            .attr('cx', function(d) {
                return d[0]/theto+10;
            })
            .attr('cy', function(d) {
                return d[1]/theto+10;
            })
            .attr('r', 2)
            .style('fill', (d, i) => {
                return this.color1[this.normalCluster.labels[i]];
            });
        svg.append("path")
            .datum(this.chainData)
            .attr("fill", "none")
            .attr("opacity", "0.3")
            .attr("stroke", "orange")
            .attr("stroke-width", 0.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);
        svg.selectAll('.circle')
            .data(this.chainData)
            .enter().append('circle')
            .attr('cx', function(d) {
                return d[0]/theto+10;
            })
            .attr('cy', function(d) {
                return d[1]/theto+10;
            })
            .attr('r', 2)
            .style('fill', (d, i) => {
                return this.color2[this.chainCluster.labels[i]];
            });
    },

    printState: function() {
        let g1 = {
            nodes: [],
            edges: []
        };
        this.normalCluster.centers.forEach((pos, id) => {
            console.log(pos);
            g1.nodes.push({
                id: 'n' + id,
                x: pos[0],
                y: pos[1],
                size: this.normalCluster.percentage[id],
                color: this.color1[id],
                label: this.normalCluster.percentage[id] + '%',
            });
        });
        this.normalCluster.trans.forEach((arr, from) => {
            arr.forEach((value, to) => {
                if ((value != '0.00') && (from != to)) {
                console.log(value);
                    g1.edges.push({
                        id: 'e' + from + '-' + to,
                        source: 'n' + from,
                        target: 'n' + to,
                        type : 'curvedArrow',
                        size: parseFloat(value),
                    });
                }
            });
        });
        let s1 = new sigma({
            graph: g1,
            renderer: {
                container: document.getElementById('state1'),
                type: 'canvas',
            },
            settings: {
                minNodeSize: 1,
                maxNodeSize: 20,
                minEdgeSize: 0.1,
                maxEdgeSize: 10,
                enableEdgeHovering: true,
                edgeHoverSizeRatio: 2
            }
        });
        let g2 = {
            nodes: [],
            edges: []
        };
        this.chainCluster.centers.forEach((pos, id) => {
            g2.nodes.push({
                id: 'A' + id,
                x: pos[0],
                y: pos[1],
                size: this.chainCluster.percentage[id],
                color: this.color2[id],
                label: this.chainCluster.percentage[id] + '%',
            });
        });
        this.chainCluster.trans.forEach((arr, from) => {
            arr.forEach((value, to) => {
                if ((value != '0.00') && (from != to)) {
                    g2.edges.push({
                        id: 'B' + from + '-' + to,
                        source: 'A' + from,
                        target: 'A' + to,
                        type : 'curvedArrow',
                        size: parseFloat(value),
                    });
                }
            });
        });
        let s2 = new sigma({
            graph: g2,
            renderer: {
                container: document.getElementById('state2'),
                type: 'canvas',
            },
            settings: {
                minNodeSize: 1,
                maxNodeSize: 20,
                minEdgeSize: 0.1,
                maxEdgeSize: 10,
                enableEdgeHovering: true,
                edgeHoverSizeRatio: 2
            }
        });
    },

    printState2: function() {
        const width = 400, height = 400;
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);
        const svg1 = d3.select('#state1').attr('width', width).attr('height', height);
        //添加defs标签
        var defs = svg1.append("defs");
        //添加marker标签及其属性
        var arrowMarker = defs.append("marker")
            .attr("id","arrow")
            .attr("markerUnits","strokeWidth")
            .attr("markerWidth",12)
            .attr("markerHeight",12)
            .attr("viewBox","0 0 12 12")
            .attr("refX",6)
            .attr("refY",6)
            .attr("orient","auto");
        var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
        arrowMarker.append("path")
            .attr("d",arrow_path)
            .attr("fill","#000");

        // console.log(this.normalCluster['centers']);
        console.log(this.normalCluster);

        this.normalCluster.trans.forEach((arr, from) => {
            arr.forEach((value, to) => {
                if (value != '0.00') {
                    var curve_path = "M10,80 Q95,10 180,80";
                    var curve = svg1.append("path")
                        .attr("d",curve_path)
                        .attr("fill","white")
                        .attr("stroke","red")
                        .attr("stroke-width",2)
                        .attr("marker-start","url(#arrow)")
                        .attr("marker-mid","url(#arrow)")
                        .attr("marker-end","url(#arrow)");
                    var line = svg1.append("line")
                        .attr("x1",this.normalCluster.centers[from][0]/2 + 10)
                        .attr("y1",this.normalCluster.centers[from][1]/2 + 10)
                        .attr("x2",this.normalCluster.centers[to][0]/2 + 10)
                        .attr("y2",this.normalCluster.centers[to][1]/2 + 10)
                        .attr("stroke","red")
                        .attr("stroke-width",2)
                        // .attr("marker-start","url(#arrow)")
                        .attr("marker-end","url(#arrow)")
                }
            });
        });

        svg1.selectAll('.circle')
            .data(this.normalCluster['centers'])
            .enter().append('circle')
            .attr('cx', function(d) {
                return d[0]/2+10;
            })
            .attr('cy', function(d) {
                return d[1]/2+10;
            })
            .attr('r', 10)
            .style('fill', (d, i) => {
                return this.color1[i];
            });
        const svg2 = d3.select('#state2').attr('width', width).attr('height', height);
        svg2.selectAll('.circle')
            .data(this.chainCluster['centers'])
            .enter().append('circle')
            .attr('cx', function(d) {
                return d[0]/2+10;
            })
            .attr('cy', function(d) {
                return d[1]/2+10;
            })
            .attr('r', 10)
            .style('fill', (d, i) => {
                return this.color2[i];
            });

    },

    printState1: function() {
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
        const width = 1000;
        let number = this.normalCluster.labels.length;
        let gridWidth = width / number;
        const gridHeight1 = 50 / this.normalNum;
        const gridHeight2 = 80 / this.chainNum;
        const time1 = d3.select('#time1').attr('width', width + 10).attr('height', gridHeight1 * (this.normalNum + 2));
        console.log(gridHeight1);

        time1.selectAll('.rect')
            .data(this.normalCluster.labels)
            .enter().append('rect')
            .attr('x', function(d, i) {return i * gridWidth + 10;})
            .attr('y', (d, i) => {
                return this.normalCluster.labels[i] * gridHeight1;
            })
            .attr('width', gridWidth)
            .attr('height', gridHeight1)
            .style('fill', (d, i) => {
                return this.color1[this.normalCluster.labels[i]];
            });

        const time2 = d3.select('#time2').attr('width', width + 10).attr('height', gridHeight2 * (this.chainNum + 2));

        time2.selectAll('.rect')
            .data(this.chainCluster.labels)
            .enter().append('rect')
            .attr('x', function(d, i) {return i * gridWidth + 10;})
            .attr('y', (d, i)=> {
                return this.chainCluster.labels[i] * gridHeight2;
            })
            .attr('width', gridWidth)
            .attr('height', gridHeight2)
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

        const width = 400, height = 400;
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);
        const chart1 = d3.select('#detail1').attr('width', width).attr('height', height);
        const chart2 = d3.select('#detail2').attr('width', width).attr('height', height);

        let zoom = 200;
        chart1.selectAll('.circle')
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

        chart2.selectAll('.circle')
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
        //P1, P2, C1, C2, R
        /*
        chart.selectAll('.circle')
            .data(chainOrigin)
            .enter().append('circle')
            .attr('cx', function(d) {
                return d[3] * zoom +50;
            })
            .attr('cy', function(d) {
                return d[4] * zoom;
            })
            .attr('r', 2)
            .style('fill', (d, i) => {
                return this.color2[this.chainCluster.labels[i]];
            });
            */
    },

    print3D: async function () {
        await jsonData.getData('normal');
        normalOrigin = jsonData.resData;
        await jsonData.getData('chain');
        chainOrigin = jsonData.resData;
        //P1, P2, C1, C2, R
        let normalData = [[], [], [], [], []];
        let chainData = [[], [], [], [], []];

        normalOrigin.forEach((value) => {
            value.forEach((detail, key) => {
                normalData[key].push(detail);
            });
        });
        chainOrigin.forEach((value) => {
            value.forEach((detail, key) => {
                chainData[key].push(detail);
            });
        });
        let color1 = [];
        this.normalCluster.labels.forEach((color, index) => {
            color1.push(this.color1[color]);
        });
        let color2 = [];
        this.chainCluster.labels.forEach((color, index) => {
            color2.push(this.color2[color]);
        });
        let trace = {
            x: chainData[2].concat(normalData[2]),
            y: chainData[3].concat(normalData[3]),
            z: chainData[4].concat(normalData[4]),
            // x: normalData[2],
            // y: normalData[3],
            // z: normalData[4],
            mode: 'lines+markers',
            marker: {
                size: 2,
                color: color2.concat(color1),
            },
            line: {
                width: 1,
                color: '#c5c5a9',
            },
            type: 'scatter3d',
        };
        let layout = {
            autosize: true,
            // height: window.innerHeight,
            height: '200px',
            scene: {
                aspectratio: {
                    x: 1,
                    y: 1,
                    z: 1,
                },
                xaxis: {
                    title: "C1",
                },
                yaxis: {
                    title: "C2",
                },
                zaxis: {
                    title: "R"
                }
            },
            margin: {
                l: 10,
                r: 0,
                b: 0,
                t: 0,
                pad: 0
            },
        };
        Plotly.newPlot('detail-3D', [trace], layout);
    },
};

(async function() {
    await processController.dataLoad();
    processController.printCluster();
    processController.printState();
    processController.printTime();
    processController.print2D();
    processController.print3D();
})();
