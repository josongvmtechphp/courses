import React, { Component } from 'react'
import './Header.css';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        let usrObj = JSON.parse(localStorage.getItem('user'));
        let webTitleEl = <Link className="navbar-brand" to="/">Course Management</Link>;
        if (usrObj && usrObj.token !== '') {
            webTitleEl = <Link className="navbar-brand" to="/courses">Course Management</Link>;
        }
        return (
            <header>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            {webTitleEl}
                        </div>
                        {(!usrObj || usrObj.token === '') &&
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link className="btn btn-sm btn-danger me-2" to="/register">Sign Up</Link></li>
                                <li><Link className="btn btn-sm btn-danger" to="/">Login</Link></li>
                            </ul>
                        }
                        {(usrObj && usrObj.token !== '') &&
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link className="btn btn-sm btn-danger me-2" to="/register">Order Details</Link></li>
                                <li><button type="button" className="btn btn-sm btn-danger">Logout</button></li>
                            </ul>
                        }
                    </div>
                </nav>
            </header>
        )
    }
}

export default Header;
