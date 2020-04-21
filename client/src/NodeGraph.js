import React, { Component } from 'react'
import * as d3 from 'd3'
import drag from './drag'

const color = () => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
}

let nodes = [
   {id: "lion", group: 1, radius: 5},
   {id: "roar", group: 1, radius: 9},
   {id: "absurdlylongname", group: 2, radius: 5},
   {id: "4", group: 2, radius: 9},
   {id: "5", group: 3, radius: 5},
   {id: "test20", group: 3, radius: 9},
];
let links = [
   {source: "lion", target: "roar", value: 1},
   {source: "roar", target: "absurdlylongname", value: 1},
   {source: "absurdlylongname", target: "4", value: 1},
   {source: "4", target: "5", value: 1},
   {source: "5", target: "test20", value: 1},
   {source: "lion", target: "test20", value: 1},
];

class NodeGraph extends Component {

   componentDidMount() {
      this.drawGraph();
   }

   drawGraph()  {
      const canvasHeight = 400;
      const canvasWidth = 600;

      const svgCanvas = d3.select(this._rootNode)
         .append("svg")
         .attr("width", canvasWidth)
         .attr("height", canvasHeight)
         .style("border", "1px solid black");

      const simulation = d3.forceSimulation(nodes)
         .force("link", d3.forceLink(links).id(d => d.id))
         .force("charge", d3.forceManyBody())
         .force("center", d3.forceCenter(canvasWidth / 2, canvasHeight / 2));

      var link = svgCanvas.append("g")
            .attr("stroke", "#999")
         .selectAll("line")
         .data(links)
         .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

      var node = svgCanvas.append("g")
         .selectAll("g")
         .data(nodes)
         .join("g")
            .call(drag(simulation));

      node.append("circle")
            .attr("r", d => d.radius)
            .attr("stroke", "white")
            .attr("fill", color())
      node.append("text")
            .attr("x", d => 1.5 * d.radius)
            .text(d => d.id)
            .attr("dominant-baseline", "middle")
         .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 3);

      simulation.on("tick", () => {
         link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
         node
            .attr("transform", d => `translate(${d.x},${d.y})`)
      });

      /*
      function spawn(source) {
         nodes.push(source);
         var target = node[0];
         links.push({source, target});

         link = link
            .data(links)
            .join("line");

         node = node
            .data(nodes)
            .join(enter => enter.append("circle").attr("r", 0)
                  .call(enter => enter.transition().attr("r", 5)),
               update => update,
               exit => exit.remove()
            );

         simulation.nodes(nodes);
         simulation.force("link").links(links);
         simulation.alpha(1).restart();

         svgCanvas.property("value", {
            nodes: nodes.map(d => ({id: d.index})),
            links: links.map(d => ({source: d.source.index, target: d.target.index}))
         });

         svgCanvas.dispatch("input");
      }
      spawn({id: "" + Math.random(), group: 4, radius: Math.random() * 10, x: 0, y: 0});
      */

   }

   shouldComponentUpdate() {
      // Prevents component re-rendering
      return false;
   }

   _setRef(componentNode) {
      this._rootNode = componentNode;
   }

   render() { return <div ref={this._setRef.bind(this)}></div> }
}

function _createForceSimulation() {
   return d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-60))
      //.force("x", d3.forceX())
      //.force("y", d3.forceY())
}

export default NodeGraph
