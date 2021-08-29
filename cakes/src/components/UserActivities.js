import React from "react";
import {makeData} from "./Utilities.js";

import Select from "react-select";
import "react-select/dist/react-select.css";
import ReactTable from "react-table";
import "react-table/react-table.css";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            data: '',
            filtered: [],
            select2: undefined
        };
    }

    componentWillMount() {
        fetch('/db/users')
            .then(response => {

                return response.json()
            })
            .then(res => {

                this.setState({users: res, data: makeData(res.length, res)});

            })
            .catch(err => {
                console.error(err);
            });
    }


    onFilteredChangeCustom = (value, accessor) => {
        let filtered = this.state.filtered;
        let insertNewFilter = 1;

        if (filtered.length) {
            filtered.forEach((filter, i) => {
                if (filter["id"] === accessor) {
                    if (value === "" || !value.length) filtered.splice(i, 1);
                    else filter["value"] = value;

                    insertNewFilter = 0;
                }
            });
        }
        if (insertNewFilter) {
            filtered.push({id: accessor, value: value});
        }

        this.setState({filtered: filtered});
    };
    render() {
        let {users, data} = this.state;
        if (users.length === 0) {
            return null;
        }

        return (
            <div>
                <br/>
                <br/>
                Extern Select2 :{" "}
                <Select
                    style={{width: "60%", marginBottom: "25px"}}
                    onChange={entry => {
                        this.setState({select2: entry});
                        this.onFilteredChangeCustom(
                            entry.map(o => {
                                return o.value;
                            }),
                            "firstName"
                        );
                    }}
                    value={this.state.select2}
                    multi={true}
                    options={this.state.data.map((o, i) => {
                        return {id: i, value: o.firstName, label: o.firstName};
                    })}
                />
                <ReactTable
                    data={data}
                    filterable
                    filtered={this.state.filtered}
                    onFilteredChange={(filtered, column, value) => {
                        this.onFilteredChangeCustom(value, column.id || column.accessor);
                    }}
                    defaultFilterMethod={(filter, row, column) => {
                        const id = filter.pivotId || filter.id;
                        if (typeof filter.value === "object") {
                            return row[id] !== undefined
                                ? filter.value.indexOf(row[id]) > -1
                                : true;
                        } else {
                            return row[id] !== undefined
                                ? String(row[id]).indexOf(filter.value) > -1
                                : true;
                        }
                    }}
                    columns={[
                        {
                            Header: "Name",
                            columns: [
                                {
                                    Header: "First Name",
                                    accessor: "firstName"
                                },
                                {
                                    Header: "Last Name",
                                    id: "lastName",
                                    accessor: d => d.lastName
                                }
                            ]
                        },
                        {
                            Header: "Info",
                            columns: [
                                {
                                    Header: "Id",
                                    accessor: "id"
                                },
                                {
                                    Header: "Role",
                                    accessor: "role",
                                    id: "role",

                                }
                            ]
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
                <br/>

            </div>
        );
    }
}
