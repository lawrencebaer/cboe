import React, { Component } from 'react';
import logo from './cboe.png';
import Chart from './components/chart';
import Spinner from './components/spinner';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './App.css';
import moment from 'moment';
import service from './services/service';
import Info from "./components/info";
import { Row, Col } from 'react-bootstrap';
const initialStart = moment('06/01/2018', 'MM/DD/YYYY');
const initialEnd = moment('06/30/2018', 'MM/DD/YYYY');
const initialSymbol = 'CBOE';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: initialStart,
            endDate: initialEnd,
            symbol: initialSymbol,
            loading: true
        };

        this.dateChanged = this.dateChanged.bind(this);
        this.onChange = this.onChange.bind(this);

    }

    componentDidMount() {
        service.getToken().then((token) => {
            this.setState({ token });
            this.dateChanged(initialStart, initialEnd);
        });
    }

    onChange(e) {
        this.setState({symbol: e.target.value});
    }

    onKeyPress(e) {
        if (e.key === 'Enter') {
            this.dateChanged(this.state.startDate, this.state.endDate, this.state.symbol);
        }
    }

    dateChanged(startDate, endDate) {
        this.setState({ loading: true });
        service.getData(startDate, endDate, this.state.symbol, this.state.token).then((chartData) => {
            chartData.symbol = this.state.symbol;

            if (chartData.messages && chartData.messages.length) {
                this.setState({
                    error: 'Invalid symbol',
                    loading: false
                });
            } else {
                this.setState({
                    error: null,
                    chartData: chartData,
                    loading: false
                });
            }

        }, () => {
            this.setState({
                error: 'An unknown error has occurred',
                loading: false
            });
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} alt="logo" />
                </header>

                <Row className="c-settings">
                    <Row>
                        <Col sm={8}>
                            <div className="c-date-range-container">
                                <strong className="c-date-range-text">Date range:</strong>
                                <DateRangePicker
                                    isOutsideRange={() => false}
                                    readOnly={true}
                                    startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                                    endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                                    onDatesChange={({ startDate, endDate }) => {
                                        this.setState({ startDate, endDate });
                                    }}
                                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                    onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                                    onClose={({ startDate, endDate }) => this.dateChanged(startDate, endDate)}
                                />
                            </div>
                        </Col>
                        <Col sm={4} className="text-right">
                            <Row>
                                <Col xs={7} md={9}>
                                    <input className="c-symbol form-control" defaultValue="CBOE" onChange={(e) => this.onChange(e)} onKeyPress={(e) => this.onKeyPress(e)}/>
                                </Col>
                                <Col xs={5} md={3}>
                                    <a className="btn btn-primary c-symbol-button form-control" onClick={() => this.dateChanged(this.state.startDate, this.state.endDate, this.state.symbol)}>Set</a>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {this.state.error ? <div className="row">
                                            <div className="col-xs-12 text-right">
                                                <span className="u-error">{this.state.error}</span>
                                            </div>
                                        </div> : ''}
                </Row>

                <Chart chartData={this.state.chartData} />
                {this.state.chartData && this.state.chartData.length ? <Info data={this.state.chartData} /> : ''}
                {this.state.loading ? <Spinner /> : ''}

                <div className="about text-right">Written by <a href="https://www.linkedin.com/in/lawrencebaer" target="_blank" rel="noopener noreferrer">Larry</a></div>
            </div>
        );
    }
}

export default App;
