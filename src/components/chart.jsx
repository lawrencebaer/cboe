import React from 'react';
import CanvasJSReact from '../canvasjs.react';
import moment from "moment/moment";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const dataPoints = [];

const options = {
    exportEnabled: true,
    title: {
        text: "CBOE"
    },
    axisX: {
        valueFormatString: "D MMM"
    },
    axisY: {
        title: "Price",
        includeZero: false,
        prefix: "$"
    },
    theme: "light2",
    animationEnabled: true,
    data: [{
        type: "candlestick",
        name: "",
        showInLegend: true,
        yValueFormatString: "$##0.00",
        xValueType: "dateTime",
        dataPoints: dataPoints
    }]
};

export default class Chart extends React.Component {
    render() {
        options.title.text = this.props.chartData ? this.props.chartData.symbol.toUpperCase() : '';
        if (this.props.chartData && !this.props.chartData.messages) {
            const results = this.props.chartData,
                dataPoints = [];

            for (let i = 0; i < results.length; i++) {
                dataPoints.push({
                    x: moment(results[i].date).valueOf(),
                    y: [ results[i].price.open, results[i].price.high, results[i].price.low, results[i].price.close ]
                });
            }

            options.data[0].dataPoints = dataPoints;
            if (dataPoints.length && this.chart) {
                this.chart.render();
            }
        }

        return (
            <div>
                <CanvasJSChart options = {options}
                               onRef={ref => this.chart = ref}
                />
            </div>
        )
    }
}