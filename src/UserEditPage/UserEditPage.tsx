import React, {useCallback, useEffect, useRef, useState} from 'react';
import UserForm from '../UserForm/UserForm';
import {RouteComponentProps} from "react-router";
import axios from 'axios';
import {baseAPI, getISODate} from '../utils';

const UserAddPage = ({history, match}: RouteComponentProps<{ userId: string }>) => {
    const formRef = useRef<any>();

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

    const onSubmit = useCallback(async (data: any) => {
        try {
            const fd = new FormData();
            const {photo, ...values} = data;
            values.birthday && (values.birthday = getISODate(values.birthday));
            fd.append("json", new Blob([JSON.stringify(values)], {type: "application/json"}));
            photo.item(0) && fd.append("photo", photo.item(0));
            await axios.put(`${baseAPI}/user/${userId}`, fd);
            history.goBack()
        } catch (e) {
            console.error(e);
            if (e.response?.data?.fields) {
                for (let value of e.response.data.fields) {
                    formRef.current?.setError(value.field, {type: 'manual', message: value.message})
                }
            }
        }
    }, [history, userId]);

    return <div className="container w-50 mt-3 mb-3">
        <h1>Edit user</h1>
        {error ?
            <h2>User not found</h2>
            : user ?
                <UserForm ref={formRef} initialValues={user} onSubmit={onSubmit}/> :
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>}
    </div>
}

export default UserAddPage;