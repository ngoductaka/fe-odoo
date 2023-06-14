import React, { Component } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

class App extends Component {
  componentDidMount() {
    let root = am5.Root.new("chartdiv");


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout,
      pinchZoomX: true
    }));


    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none"
    }));
    cursor.lineY.set("visible", false);


    // The data
    let data = [{
      "year": "01/2023",
      "cars": 1587,
      "motorcycles": 650,
      "bicycles": 121
    }, {
      "year": "02/2023",
      "cars": 1567,
      "motorcycles": 683,
      "bicycles": 146
    }, {
      "year": "03/2023",
      "cars": 1617,
      "motorcycles": 691,
      "bicycles": 138
    }, {
      "year": "04/2023",
      "cars": 1630,
      "motorcycles": 642,
      "bicycles": 127
    }, {
      "year": "05/2023",
      "cars": 1660,
      "motorcycles": 699,
      "bicycles": 105
    }, {
      "year": "06/2023",
      "cars": 1683,
      "motorcycles": 721,
      "bicycles": 109
    }];


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "year",
      startLocation: 0.5,
      endLocation: 0.5,
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));

    xAxis.data.setAll(data);

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      max: 100,
      calculateTotals: true,
      numberFormat: "#'%'",
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function createSeries(name, field) {
      let series = chart.series.push(am5xy.LineSeries.new(root, {
        name: name,
        stacked: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: field,
        categoryXField: "year",
        valueYShow: "valueYTotalPercent",
        legendValueText: "{valueY}",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "[bold]{name}[/]\n{categoryX}: {valueYTotalPercent.formatNumber('#.0')}% ({valueY})"
        })
      }));

      series.fills.template.setAll({
        fillOpacity: 0.5,
        visible: true
      });

      series.data.setAll(data);
      series.appear(1000);
    }

    createSeries("시간을 늦추다", "motorcycles");
    createSeries("시간에 맞추다", "bicycles");

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));


    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }));

    legend.data.setAll(chart.series.values);


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);


    this.root = root;
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    return <div id="chartdiv" style={{ width: "100%", height: "60vh", margin: "20px" }}></div>;
  }
}

export default App;
