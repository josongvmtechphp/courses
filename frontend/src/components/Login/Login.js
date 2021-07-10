import React, { Component } from 'react'
import { Alert } from "react-bootstrap";

export default class Login extends Component {
    state = {
        userEmail: '', userPassword: '', isValueEntered: false,
        resType: '', resMsg: ''
    };

    handleInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            isValueEntered: true
        });
    }

    loginUser = (event) => {
        event.preventDefault();
        const serverUrl = 'http://localhost:3004/api/user/login'; let storedStr = '';
        const userObj = {
            email: this.state.userEmail,
            password: this.state.userPassword
        };
        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(userObj)
        }).then(res => res.json()).then(output => {
            this.setState({
                resType: (output.status === 'success') ? 'success' : 'failure',
                resMsg: output.message
            });
            if (output.status === 'success') {
                storedStr = JSON.stringify({ token: output.token, fullName: output.fullName, email: output.email });
                localStorage.setItem('user', storedStr);
                this.props.history.push('/courses');
            }
        }).catch((error) => {
            this.setState({ resType: 'failure', resMsg: error.message });
        });
    }
    render() {
        let formValid = true;
        let emailRegExp = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g);
        let userEmailErr = <div className="d-none"></div>;
        let userPasswordErr = <div className="d-none"></div>;
        let resElement = <></>;
        let usrObj = JSON.parse(localStorage.getItem('user'));
        if (usrObj && usrObj.token !== '') {
            return (<h2 className="text-danger">Access denied</h2>);
        }
        if (!this.state.isValueEntered) {
            formValid = false;
        }
        if (this.state.isValueEntered && (this.state.userEmail.trim() === ''
            || !emailRegExp.test(this.state.userEmail.trim()))) {
            userEmailErr = <div className="text-danger">Invalid E-mail</div>;
            formValid = false;
        }
        if (this.state.isValueEntered && this.state.userPassword.trim() === '') {
            userPasswordErr = <div className="text-danger">This field is required</div>;
            formValid = false;
        }
        if (this.state.isValueEntered && this.state.resType === 'success') {
            resElement = <Alert variant="success">{this.state.resMsg}</Alert>;
        } else if (this.state.isValueEntered && this.state.resType === 'failure') {
            resElement = <Alert variant="danger">{this.state.resMsg}</Alert>;
        }
        return (
            <form id="userLoginForm" className="mt-2" onSubmit={(event) => this.loginUser(event)}>
                {resElement}
                <div className="mb-3 mt-3">
                    <h2>Login</h2>
                </div>
                <div className="mb-3">
                    <label htmlFor="userEmail" className="form-label">Email address</label>
                    <input type="email" className="form-control" name="userEmail" id="userEmail" onChange={(event) => this.handleInput(event)} value={this.state.userEmail} />
                    {userEmailErr}
                </div>
                <div className="mb-3">
                    <label htmlFor="userPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" name="userPassword" id="userPassword" onChange={(event) => this.handleInput(event)} value={this.state.userPassword} />
                    {userPasswordErr}
                </div>
                <button type="submit" className="btn btn-primary" disabled={!formValid}>Save</button>
            </form>
        )
    }
}
