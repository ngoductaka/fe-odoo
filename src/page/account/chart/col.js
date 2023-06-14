
import React, { Component } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

class App extends Component {
  componentDidMount() {
    /* Chart code */

    /* Chart code */

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new("chartdiv4");


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout
    }));


    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
      })
    );

    let data = [{
      "year": "03",
      "europe": 2500,
      "namerica": 2500,
      "asia": 2100,
    }, {
      "year": "04",
      "europe": 2600,
      "namerica": 2700,
      "asia": 2200,
    }, {
      "year": "05",
      "europe": 2800,
      "namerica": 2900,
      "asia": 2400,
    }]


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9
    })

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "year",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    xRenderer.grid.template.setAll({
      location: 1
    })

    xAxis.data.setAll(data);

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name, fieldName) {
      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "year"
      }));

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}:{valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0
      });

      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

      legend.data.push(series);
    }

    makeSeries("창고 A", "europe");
    makeSeries("창고 B", "namerica");
    makeSeries("위험물 보관창고", "asia");
    // makeSeries("Latin America", "lamerica");
    // makeSeries("Middle East", "meast");
    // makeSeries("Africa", "africa");


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/

    this.root = root;
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    return <div id="chartdiv4" style={{ width: "100%", height: "60vh", margin: "20px" }}></div>;
  }
}

export default App;
