import React, {useCallback, useRef} from 'react';
import UserForm from '../UserForm/UserForm';
import {RouteComponentProps} from "react-router";
import axios from 'axios';
import {baseAPI, getISODate} from "../utils";

const UserAddPage = ({history}: RouteComponentProps) => {
    const formRef = useRef<any>();

    const onSubmit = useCallback(async (data: any) => {
        try {
            const fd = new FormData();
            const {photo, ...values} = data;
            values.birthday && (values.birthday = getISODate(values.birthday));
            fd.append("json", new Blob([JSON.stringify(values)], {type: "application/json"}));
            photo.item(0) && fd.append("photo", photo.item(0));
            await axios.post(baseAPI + '/user', fd);
            history.goBack()
        } catch (e) {
            console.error(e);
            if (e.response?.data?.fields) {
                for (let value of e.response.data.fields) {
                    formRef.current?.setError(value.field, {type: 'manual', message: value.message})
                }
            }
        }
    }, [history]);

    return <div className="container w-50 mt-3 mb-3">
        <h1>Add new user</h1>
        <UserForm ref={formRef} onSubmit={onSubmit}/>
    </div>
}

export default UserAddPage;