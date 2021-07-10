import React, { Component } from 'react';
import { Alert } from "react-bootstrap";

class Register extends Component {
    state = {
        userFullName: '', userEmail: '', userPassword: '',
        isValueEntered: false, resType: '', resMsg: ''
    };
    handleInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            isValueEntered: true
        });
    }
    createUser = (event) => {
        event.preventDefault();
        const serverUrl = 'http://localhost:3004/api/user/create'; let isSuccess = true;
        const userObj = {
            fullName: this.state.userFullName,
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
            if (output.status === 'failure') { isSuccess = false; }
            this.setState({
                resType: (isSuccess) ? 'sucess' : 'failure',
                resMsg: output.message
            });
        }).catch((err) => { this.setState({ resType: 'failure', resMsg: err.message }); });
    }
    render() {
        let formValid = true;
        let emailRegExp = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g);
        let fullNameErr = <div className="d-none"></div>;
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
        if (this.state.isValueEntered && this.state.userFullName.trim() === '') {
            fullNameErr = <div className="text-danger">This field is required</div>;
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
        if (this.state.isValueEntered && this.state.resType === 'sucess') {
            resElement = <Alert variant="success">{this.state.resMsg}</Alert>;
        } else if (this.state.isValueEntered && this.state.resType === 'failure') {
            resElement = <Alert variant="danger">{this.state.resMsg}</Alert>;
        }

        return (
            <form id="userRegForm" className="mt-2" onSubmit={(event) => this.createUser(event)}>
                {resElement}
                <div className="mb-3 mt-3">
                    <h2>User Register</h2>
                </div>
                <div className="mb-3">
                    <label htmlFor="userFullName" className="form-label">Full name</label>
                    <input type="text" className="form-control" name="userFullName" id="userFullName" onChange={(event) => this.handleInput(event)} value={this.state.userFullName} />
                    {fullNameErr}
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

export default Register;
