import React, { Component } from 'react'

export default class Courses extends Component {
    state = { courses: [] };
    getCourses() {
        const serverUrl = 'http://localhost:3004/api/course/list'; let token = '';
        const usrObj = JSON.parse(localStorage.getItem('user'));
        if (usrObj && usrObj.token && usrObj.token !== '') {
            token = usrObj.token;
        }
        fetch(serverUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'authorization': 'Bearer ' + token
            }
        }).then(res => res.json()).then(output => {
            if (output.status === 'success') {
                console.log('Courses', output);
                this.setState({ courses: output.records });
            }
        }).catch((error) => {
            console.log(error.message);
            this.setState({ courses: [] });
        });
    }
    render() {
        let usrObj = JSON.parse(localStorage.getItem('user')); let fullName;
        if (!usrObj || (usrObj && usrObj.token === '')) {
            return (<h2 className="text-danger">Access denied</h2>);
        }
        fullName = usrObj.fullName;
        return (
            <div>
                <div className="fw-bolder my-2">Welcome {fullName}</div>
                <div className="card-group">
                    {this.state.courses.map((course) => {
                        <div className="card">
                            <img src={course.thumb} className="card-img-top" alt={course.title} />
                            <div className="card-body">
                                <h5 className="card-title">{course.title}</h5>
                                <p className="card-text">{course.description}</p>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        )
    }
}
