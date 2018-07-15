import React from 'react';
import 'react-fontawesome';

export default class Spinner extends React.Component {
    render() {
        return (
            <div className="c-spinner-container">
                <i className="fa fa-spinner fa-spin fa-4x"></i>
            </div>
        )
    }
}