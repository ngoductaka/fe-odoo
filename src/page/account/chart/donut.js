
import React, { Component } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

class App extends Component {
  componentDidMount() {
    /* Chart code */

/* Chart code */
// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
let root = am5.Root.new("chartdiv9");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
let chart = root.container.children.push(am5percent.PieChart.new(root, {
  layout: root.verticalLayout,
  innerRadius: am5.percent(50)
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
let series = chart.series.push(am5percent.PieSeries.new(root, {
  valueField: "value",
  categoryField: "category",
  alignLabels: false
}));

series.labels.template.setAll({
  textType: "circular",
  centerX: 0,
  centerY: 0
});


// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
series.data.setAll([
  { value: 950, category: "제품이 좋다" },
  { value: 50, category: "반품 상품" },
  // { value: 6, category: "Three" },
  // { value: 5, category: "Four" },
  // { value: 4, category: "Five" },
  // { value: 3, category: "Six" },
  // { value: 1, category: "Seven" },
]);


// Create legend
// https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
let legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.percent(50),
  x: am5.percent(50),
  marginTop: 15,
  marginBottom: 15,
}));

legend.data.setAll(series.dataItems);



    this.root = root;
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    return <div id="chartdiv9" style={{ width: "100%", height: "60vh",  margin: "20px" }}></div>;
  }
}

export default App;
