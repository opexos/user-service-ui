import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {RouteComponentProps} from "react-router";
import axios from 'axios';
import EditIcon from '../assets/edit.svg';
import DeleteIcon from '../assets/delete.svg';
import ViewIcon from '../assets/view.svg';
import {baseAPI} from "../utils";

const Users = ({history, location}: RouteComponentProps) => {
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState<any>(null)

    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const page = Number(queryParams.get("page")) || 0;
    const fullNameFilter = queryParams.get("fullName");

    const updateUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(baseAPI + "/user", {
                params: {
                    pageSize: 10,
                    pageNum: page,
                    fullName: fullNameFilter
                }
            })
            setResponse(response.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [fullNameFilter, page]);

    const deleteUser = useCallback(async (id: number) => {
        await axios.delete(`${baseAPI}/user/${id}`);
        await updateUsers();
    }, [updateUsers]);


    useEffect(() => {
        updateUsers();
    }, [page, fullNameFilter, updateUsers]);

    const tableRows = useMemo(() => response?.content?.map((value: any) =>
        <tr key={value.userId} className="align-items-center">
            <td>
                <div className="d-flex">
                    <button className="btn btn-sm btn-primary me-2"
                            onClick={() => history.push(`/edit/${value.userId}`)}>
                        <img src={EditIcon} alt=""/>
                    </button>
                    <button className="btn btn-sm btn-danger me-2" onClick={() => deleteUser(value.userId)}>
                        <img src={DeleteIcon} alt=""/>
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => history.push(`/view/${value.userId}`)}>
                        <img src={ViewIcon} alt=""/>
                    </button>
                </div>
            </td>
            <td>{value.userId}</td>
            <td>{value.username}</td>
            <td>{value.fullName}</td>
        </tr>), [deleteUser, history, response])

    const searchInputRef = useRef<any>();
    const search = useCallback(() => {
        let fullName = searchInputRef.current.value;
        fullName = fullName.trim();
        if (fullName === "") {
            queryParams.delete("fullName");
        } else {
            queryParams.set("fullName", fullName);
        }
        queryParams.set("page", "0");
        history.push("/?" + queryParams.toString());
    }, [history, queryParams, searchInputRef]);
    const preventDefault = useCallback((e) => e.preventDefault(), []);

    return <div className="container-fluid mt-3">
        <div className="d-flex justify-content-between align-items-center">
            <h1>Users</h1>
            <div>
                <button className="btn btn-primary" onClick={() => history.push("/add")}>Add user</button>
            </div>
        </div>
        <div>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-2">
                    <label htmlFor="search-input" className="form-label">Search by full name:</label>
                    <input type="text" id="search-input" className="form-control" ref={searchInputRef}
                           onKeyDown={(e) => {
                               if (e.key === "Enter") {
                                   search();
                               }
                           }}
                           defaultValue={fullNameFilter || ""}
                    />
                </div>
                <button type="button" className="btn btn-sm btn-primary"
                        onMouseDown={preventDefault}
                        onClick={search}>
                    Search
                </button>
            </form>
        </div>
        {loading ?
            <div className="spinner-border text-primary mt-3" role="status">
                <span className="visually-hidden">Loading...</span>
            </div> :
            <div>
                <table className="table align-middle">
                    <colgroup>
                        <col style={{width: "min-content"}}/>
                        <col style={{width: "min-content"}}/>
                        <col style={{width: "300px"}}/>
                        <col/>
                    </colgroup>
                    <thead>
                    <tr>
                        <th scope="col"/>
                        <th scope="col">#</th>
                        <th scope="col">Username</th>
                        <th scope="col">Full name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableRows}
                    </tbody>
                </table>
                <div className="d-flex w-100 justify-content-end">
                    <nav aria-label="page-navigation">
                        <ul className="pagination">
                            <li className={`page-item ${response && response?.first ? "disabled" : ""}`}>
                                <button className="page-link" aria-label="Previous"
                                        onMouseDown={preventDefault}
                                        onClick={() => {
                                            queryParams.set("page", String(page - 1));
                                            history.push("/?" + queryParams.toString());
                                        }}>
                                    <span aria-hidden="true">&laquo;</span>
                                </button>
                            </li>
                            <li className="page-item active">
                                <p className="page-link">
                                    {response?.totalPages === 0 ? 0 : page + 1} of {response?.totalPages || 0}
                                </p>
                            </li>
                            <li className={`page-item ${response && response?.last ? "disabled" : ""}`}>
                                <button className="page-link" aria-label="Next"
                                        onMouseDown={preventDefault}
                                        onClick={() => {
                                            queryParams.set("page", String(page + 1));
                                            history.push("/?" + queryParams.toString());
                                        }}>
                                    <span aria-hidden="true">&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        }
    </div>
}

export default Users;