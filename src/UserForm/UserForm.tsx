import React, {forwardRef, useImperativeHandle} from 'react';
import {useHistory} from "react-router";
import {Controller, useForm} from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {baseAPI} from "../utils";

const UserForm = forwardRef(({
                                 initialValues,
                                 onSubmit,
                                 readOnly
                             }:
                                 {
                                     initialValues?: any,
                                     onSubmit?: (values: any) => any,
                                     readOnly?: boolean
                                 }, ref) => {
    const history = useHistory();
    const {register, errors, handleSubmit, setError, setValue, clearErrors, control} =
        useForm({
            defaultValues: {
                ...initialValues,
                photoAction: "NO_CHANGES",
                birthday: initialValues?.birthday || null
            }
        });

    useImperativeHandle(ref, () => ({
        setError,
        clearErrors
    }))

    return <form className="needs-validation"
                 onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}
                 onKeyDown={(e) => e.key !== "Enter"}>
        {initialValues || readOnly ? <div className="mb-3">
            <label htmlFor="userId" className="form-label">User ID</label>
            <input type="text" id="userId" name="userId"
                   readOnly={true}
                   className="form-control"
                   ref={register}/>
        </div> : null}
        <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" id="username" name="username" readOnly={readOnly}
                   className={`form-control ${errors.username && "is-invalid"}`}
                   ref={register}/>
            <div className="invalid-feedback">{errors.username?.message}</div>
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input type="text" id="email" name="email" className={`form-control ${errors.email && "is-invalid"}`}
                   readOnly={readOnly}
                   ref={register}/>
            <div className="invalid-feedback">{errors.email?.message}</div>
        </div>
        <div className="mb-3">
            <label htmlFor="full-name" className="form-label">Full name</label>
            <input type="text" id="full-name" name="fullName" readOnly={readOnly}
                   className={`form-control ${errors.fullName && "is-invalid"}`}
                   ref={register}/>
            <div className="invalid-feedback">{errors.fullName?.message}</div>
        </div>
        <div className="mb-3">
            <label htmlFor="birthday" className="form-label">Birthday</label>
            <Controller
                name="birthday"
                id="birthday"
                control={control}
                render={({onChange, value}) =>
                    <DatePicker
                        className="form-control"
                        selected={value}
                        onChange={onChange}
                        readOnly={readOnly}
                    />
                }
            />
            <div className="invalid-feedback">{errors.birthday?.message}</div>
        </div>
        <div className="mb-3">
            <label>Sex</label>
            <div className="form-check">
                <input className={`form-check-input ${errors.sex && "is-invalid"}`} type="radio" name="sex"
                       id="sex-na-radio" ref={register} disabled={readOnly}
                       value="" defaultChecked={true}/>
                <label className="form-check-label" htmlFor="sex-na-radio">
                    Not stated
                </label>
            </div>
            <div className="form-check">
                <input className={`form-check-input ${errors.sex && "is-invalid"}`} type="radio" name="sex"
                       id="sex-male-radio" ref={register} disabled={readOnly}
                       value="MALE"/>
                <label className="form-check-label" htmlFor="sex-male-radio">
                    Male
                </label>
            </div>
            <div className="form-check">
                <input className={`form-check-input ${errors.sex && "is-invalid"}`} type="radio" name="sex"
                       id="sex-female-radio" ref={register} disabled={readOnly}
                       value="FEMALE"/>
                <label className="form-check-label" htmlFor="sex-female-radio">
                    Female
                </label>
            </div>
            <div className="invalid-feedback">{errors.sex?.message}</div>
        </div>
        <div className="mb-3">
            <label htmlFor="photo">Photo</label>
            {!readOnly ?
                <div className="input-group">
                    <input type="file" name="photo" className="form-control" id="photo" ref={register}
                           readOnly={readOnly}
                           accept="image/jpeg"
                           onChange={(e) => {
                               const photoPreview = document.getElementById('photo-preview') as HTMLImageElement | null;
                               if (photoPreview) {
                                   photoPreview.src = window.URL.createObjectURL(e.target.files?.item(0));
                                   photoPreview.hidden = false;
                                   setValue("photoAction", "UPLOAD");
                               }
                           }}/>
                    <button type="button" className="btn btn-outline-secondary"
                            onClick={() => {
                                const photoPreview = document.getElementById('photo-preview') as HTMLImageElement | null;
                                photoPreview && (photoPreview.hidden = true);
                                setValue("photo", undefined);
                                setValue("photoAction", "DELETE");
                            }}>
                        Clear photo
                    </button>
                </div> : <br/>}
            <div className="invalid-feedback">{errors.photo?.message}</div>
            <img src={initialValues?.userId && `${baseAPI}/user/${initialValues.userId}/photo`}
                 onLoad={(e) => {
                     e.currentTarget.hidden = false
                 }}
                 hidden={true}
                 className="mt-3" id="photo-preview" alt="" width={200} height={200}/>
        </div>
        {readOnly ?
            <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Go back</button> :
            <div className="d-flex">
                <button type="submit" className="btn btn-primary me-3">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
            </div>}
        <input type="text" hidden={true} name="photoAction" ref={register}/>
    </form>
})

export default UserForm;