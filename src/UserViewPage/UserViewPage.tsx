import React, {useEffect, useState} from 'react';
import UserForm from '../UserForm/UserForm';
import {RouteComponentProps} from "react-router";
import axios from 'axios';
import {baseAPI} from "../utils";

const UserViewPage = ({match}: RouteComponentProps<{ userId: string }>) => {
    const userId = Number(match.params.userId);

    const [user, setUser] = useState();
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${baseAPI}/user/${userId}`);
                setUser({
                    ...response.data,
                    birthday: response.data.birthday ? new Date(response.data.birthday) : undefined
                });
            } catch (e) {
                setError(true);
            }
        })()
    }, [userId])

    return <div className="container w-50 mt-3 mb-3">
        <h1>View user</h1>
        {error ?
            <h2>User not found</h2> :
            user ?
                <UserForm initialValues={user} readOnly/> :
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>}
    </div>
}

export default UserViewPage;