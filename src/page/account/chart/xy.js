
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
    let root = am5.Root.new("chartdiv91");



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
      pinchZoomX: true
    }));

    chart.get("colors").set("step", 3);


    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.3,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));


    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }));

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.LineSeries.new(root, {
      name: "창고 A",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value1",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "창고 A: {value2}"
      })
    }));

    series.strokes.template.setAll({
      strokeWidth: 2
    });

    series.get("tooltip").get("background").set("fillOpacity", 0.5);
    // 
    let series3 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "창고 B",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value3",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "창고 B: {value3}"
      })
    }));

    series3.strokes.template.setAll({
      strokeWidth: 2
    });

    series3.get("tooltip").get("background").set("fillOpacity", 0.5);

    let series4 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "위험물 보관창고",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value4",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "위험물 보관창고: {value4}"
      })
    }));

    series4.strokes.template.setAll({
      strokeWidth: 2
    });

    series4.get("tooltip").get("background").set("fillOpacity", 0.5);

    let series2 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "반품 창고",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value2",
      tooltip: am5.Tooltip.new(root, {
        labelText: "반품 창고: {value2}"
      }),
      valueXField: "date"
    }));
    series2.strokes.template.setAll({
      strokeDasharray: [2, 2],
      strokeWidth: 2
    });

    // Set date fields
    // https://www.amcharts.com/docs/v5/concepts/data/#Parsing_dates
    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd",
      dateFields: ["valueX"]
    });


    // Set data
    let data = [{
      date: new Date(2023, 5, 12).getTime(),
      value1: 50,
      value4: 50+5,
      value3: 50-10,
      value2: 48,
      previousDate: new Date(2023, 5, 5)
    }, {
      date: new Date(2023, 5, 13).getTime(),
      value1: 53,
      value4: 53+5,
      value3: 53-10,
      value2: 51,
      previousDate: "2023-05-06"
    }, {
      date: new Date(2023, 5, 14).getTime(),
      value1: 56,
      value4: 56+5,
      value3: 56-10,
      value2: 58,
      previousDate: "2023-05-07"
    }, {
      date: new Date(2023, 5, 15).getTime(),
      value1: 52,
      value4: 52+5,
      value3: 52-10,
      value2: 53,
      previousDate: "2023-05-08"
    }, {
      date: new Date(2023, 5, 16).getTime(),
      value1: 48,
      value4: 48+5,
      value3: 48-10,
      value2: 44,
      previousDate: "2023-05-09"
    }, {
      date: new Date(2023, 5, 17).getTime(),
      value1: 47,
      value4: 47+5,
      value3: 47-10,
      value2: 42,
      previousDate: "2023-05-10"
    }, {
      date: new Date(2023, 5, 18).getTime(),
      value1: 59,
      value4: 59+5,
      value3: 59-10,
      value2: 55,
      previousDate: "2023-05-11"
    }]

    series.data.setAll(data);
    series2.data.setAll(data);
    series3.data.setAll(data);
    series4.data.setAll(data);


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    series2.appear(1000);
    series3.appear(1000);
    series4.appear(1000);
    chart.appear(1000, 100);
    legend.data.push(series);
    legend.data.push(series2);
    legend.data.push(series3);
    legend.data.push(series4);


    this.root = root;
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    return <div id="chartdiv91" style={{ width: "100%", height: "60vh", margin: "20px" }}></div>;
  }
}

export default App;
