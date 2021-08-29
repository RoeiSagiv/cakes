import React from 'react';
import {Link} from "react-router-dom";

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: ''
        }
    }

    componentDidMount() {
        let currentUser = JSON.parse(localStorage.getItem('user'));
        this.setState({user: currentUser})
    }

    render() {
        const {user} = this.state;
        return (
            <div className="container">
                <h2 className="card-title">My Profile</h2>
                <div className="row">
                    <div className="col-md-12 col-sm-6 col-md-6">
                        <div className="well well-sm">
                            <div className="row">

                                <div className="col-sm-6 col-md-8">
                                    <h3>
                                        {user.firstName} {user.lastName}</h3>
                                    <small><cite style={{fontSize:"16px"}} title={user.address}>{user.address} <i className="glyphicon glyphicon-map-marker">
                                    </i></cite></small>
                                    <p style={{fontSize:"16px"}}>
                                        <i className="glyphicon glyphicon-envelope"/>{user.email}
                                        <br/>
                                        <i className="glyphicon glyphicon-globe"/>{user.username}
                                        <br/>
                                        <i className="glyphicon glyphicon-star-empty"/>{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ul>
                    <Link className="nav-item nav-link float-right" to="/cart">
                        <button type="button" className="btn btn-info">Cart</button>
                    </Link>

                    <Link className="nav-item nav-link" to="/checkout">
                        <button className="btn btn-success float-right">Checkout
                        </button>
                    </Link>
                </ul>
            </div>

        )
    }
}
