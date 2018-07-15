import React from 'react';
import moment from 'moment';
import { Alert } from 'react-bootstrap';

export default class Stats extends React.Component {
    render() {

        // Part 1 algorithm here

        const {data} = this.props;

        // Assume open prices of the following: [20, 21, 23, 24, 27, 24, 19, 20, 24, 23, 27, 22, 21]
        // The biggest profit is made from here ------------------------ ^^ to here ---  ^^

        // First, get a flat list of opening prices
        const opens = data.map(x => x.price.open);

        // Next, compare all past and future pairs and find the largest difference
        let largestDiff = 0;
        let minIndex, maxIndex;

        for (let i = 0; i < opens.length; i++) {
            for (let j = i + 1; j < opens.length; j++) {

                let first = opens[i];
                let second = opens[j];
                let diff = second - first;

                if (second > first && diff > largestDiff) {

                    // Store the largest difference as well as the indexes at which it occurred
                    largestDiff = diff;
                    minIndex = i;
                    maxIndex = j;
                }
            }
        }

        if (largestDiff) {
            const lowest = (data[minIndex].price.open).toFixed(2);
            const lowestDate = moment(data[minIndex].date).format('MMMM Do, YYYY');
            const highest = (data[maxIndex].price.open).toFixed(2);
            const highestDate = moment(data[maxIndex].date).format('MMMM Do, YYYY');
            const profit = (highest - lowest).toFixed(2);

            return (
                <div className="c-info-container">
                    <Alert className="alert-success">
                        <p className="u-font-24 alert-heading">The maximum profit for this range is ${profit}.</p>
                        <p className="">If you purchased on {lowestDate} (for ${lowest}) and sold on {highestDate} (for ${highest}), your profit would have been ${profit}.</p>
                    </Alert>
                </div>
            )
        } else {
            return (
                <div className="c-info-container">
                    <Alert className="alert-warning">
                        <p className="u-font-24">No profit can be made for this time range.</p>
                    </Alert>
                </div>
            )
        }
    }
}