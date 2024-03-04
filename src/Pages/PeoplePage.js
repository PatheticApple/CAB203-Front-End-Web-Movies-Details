import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Chart, { Ticks } from 'chart.js/auto';



const columns = [
    { headerName: "Role", field: "role", flex: 1 },
    { headerName: "Movie", field: "movie", filter: true, flex: 1 },
    { headerName: "Characters", field: "characters", flex: 1 },
    { headerName: "Rating", field: "rating", flex: 1, sortable: true,
    // filter: "agNumberColumnFilter"
}
];

export default function PeoplePage() {
    const [searchParams] = useSearchParams();
    const ID = searchParams.get("ID");
    const [name, setName] = useState();
    const [birthYear, setBirthYear] = useState();
    const [deathYear, setDeathYear] = useState();
    const [rowData3, setRowData3] = useState([]);
    const [error, setError] = useState();

    const navigate = useNavigate();
    const [bearerToken, setNewBearerToken] = useState(localStorage.getItem("token"))
    //const [bearerToken, setNewBearerToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhcnkzQGdtYWlsLmNvbSIsImV4MTY4MTk3MzM0OCwiaWF0IjoxNjgxOTcyNzQ4fQ.i3ODKt7bo88KSe49Qvby6rSLpiGgkUn4AhoXsum--8k")
    //const token = localStorage.getItem("token")
    const [refreshToken, setNewRefreshToken] = useState(localStorage.getItem("refreshToken"))
    //const rtoken = localStorage.getItem("refreshToken")
    const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhcnkzQGdtYWlsLmNvbSIsImV4MTY4MTk3MzM0OCwiaWF0IjoxNjgxOTcyNzQ4fQ.i3ODKt7bo88KSe49Qvby6rSLpiGgkUn4AhoXsum--8k"
    //console.log(bearerToken)

    const {personURL} = require('../URL/apiURL')

    // Fetching Person Data
    useEffect(() => {
        (async () => {
            let res = await fetch(`${personURL}${ID}`, {
                method: "GET",
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${bearerToken}` // User's BearerToken (could be expired)
                }
            })
            let data = await res.json();
            let fetchStatus = res.status
            //console.log(data);
            console.log(fetchStatus);

            if (fetchStatus === 401) { // If User's Bearer Token is expired and getting error code 401
                console.log("Getting new tokens") 
                // Fetching new Bearer token using RefreshToken
                return fetch("http://sefdb02.qut.edu.au:3000/user/refresh", { 
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refreshToken: refreshToken }), // User's refresh token
                })
                    .then((res) => {
                        // If User's RefreshToken also expired, or the user has logged out with no tokens,
                        // and still getting error code 401
                        if (res.status === 401) { 
                            console.log('401');
                            setError("Session Expired. Please log in again");
                            localStorage.setItem("status", 'loggedOut');
                            console.log(res);
                        }
                        else if (res.status === 400) { // If there's no tokens
                            setError("Please Log In Again")
                        }
                        else if (res.status === 404) { // If there's no valid person ID
                            setError("404 \n No record exists of a person with this ID")
                        }
                        else {
                            console.log(res.status);
                            return res.json();
                        }
                    })
                    //.then((res) => res.json())
                    .then((res) => new Promise((resolve, reject) => {
                        setNewBearerToken(res.bearerToken.token);
                        setNewBearerToken(res.refreshToken.token);
                        localStorage.setItem("token", res.bearerToken.token);
                        localStorage.setItem("refreshToken", res.refreshToken.token);
                        console.log("New bearer token:", bearerToken)
                        console.log("New refresh token:", refreshToken)
                    }))

                    .catch((error) => {
                        console.log('Another error', error)
                    });
            }
            else if (fetchStatus === 400) { // If there's year parameter being passed
                setError("Invalid query parameters: year. Query parameters are not permitted.")
            }
            else if (fetchStatus === 404) { // If there's no valid person ID
                setError("404 No record exists of a person with this ID")
            }
            else {
                let roles = data.roles;
                let tableroles = roles.map((role) => ({
                    role: role.category,
                    movie: role.movieName,
                    characters: role.characters,
                    rating: role.imdbRating,
                    movID: role.movieId
                }));

                // Variables for chart component
                let imdb0to1 = 0;
                let imdb1to2 = 0;
                let imdb2to3 = 0;
                let imdb3to4 = 0;
                let imdb4to5 = 0;
                let imdb5to6 = 0;
                let imdb6to7 = 0;
                let imdb7to8 = 0;
                let imdb8to9 = 0;
                let imdb9to10 = 0;
                // Function to set value for chart component
                roles.map((role) => {
                    if (role.imdbRating >= 0 && role.imdbRating < 1) {
                        imdb0to1 += 1;
                    }
                    else if (role.imdbRating >= 1 && role.imdbRating < 2) {
                        // console.log(role.imdbRating);
                        imdb1to2 += 1;
                    }
                    else if (role.imdbRating >= 2 && role.imdbRating < 3) {
                        // console.log(role.imdbRating);
                        imdb2to3 += 1;
                    }
                    else if (role.imdbRating >= 3 && role.imdbRating < 4) {
                        // console.log(role.imdbRating);
                        imdb3to4 += 1;
                    }
                    else if (role.imdbRating >= 4 && role.imdbRating < 5) {
                        // console.log(role.imdbRating);
                        imdb4to5 += 1;
                    }
                    else if (role.imdbRating >= 5 && role.imdbRating < 6) {
                        // console.log(role.imdbRating);
                        imdb5to6 += 1;
                    }
                    else if (role.imdbRating >= 6 && role.imdbRating < 7) {
                        // console.log(role.imdbRating);
                        imdb6to7 += 1;
                    }
                    else if (role.imdbRating >= 7 && role.imdbRating < 8) {
                        //console.log(role.imdbRating);
                        imdb7to8 += 1;
                    }
                    else if (role.imdbRating >= 8 && role.imdbRating < 9) {
                        // console.log(role.imdbRating);
                        imdb8to9 += 1;
                    }
                    else if (role.imdbRating >= 9 && role.imdbRating < 10) {
                        // console.log(role.imdbRating);
                        imdb9to10 += 1;
                    }
                })
                //console.log(imdb7to8);
                //console.log(tableroles);
                setRowData3(tableroles);
                //console.log(data);
                //console.log(data.roles);
                setName(data.name);
                setBirthYear(data.birthYear);
                setDeathYear(data.deathYear);

               
                // Chart component
                let data2 = {
                    labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"],
                    datasets: [{
                        label: "Count",
                        backgroundColor: "rgba(255,65,80,0.2)",
                        borderColor: "rgba(255,50,70,1)",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(255,99,132,0.4)",
                        hoverBorderColor: "rgba(255,99,132,1)",
                        data: [imdb0to1, imdb1to2, imdb2to3, imdb3to4, imdb4to5, imdb5to6, imdb6to7, imdb7to8, imdb8to9, imdb9to10],
                    }]
                };
                let options2 = {
            
                    plugins: {
                        legend: {
                            display: false,
                        }},
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                max: 20,
                                stacked: true,
                                grid: {
                                    display: true,
                                    color: "rgba(255,255,255,0.2)"
                                },
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    };

                    new Chart('chart', {
                        type: 'bar',
                        options: options2,
                        data: data2
                    });

                }

            })();
    }, [ID, bearerToken]);




    return (
        
        <div className='MovieSection'>
            {error != null ? <h1 style={{height: '650px'}} >{error}</h1> : 
            <div>
            <h1 className="NameTitle">{name}</h1>
                <hr></hr>
            <div className="personInformations">
                {/* <p>{ID}</p> */}
                {/* <p>Name: {name}</p> */}
                <p>Live: <b>{birthYear}</b> - <b>{deathYear}</b></p>
                <div id="personTable" className="ag-theme-alpine" style={{ height: '560px', width: "100%" }}>
                    <AgGridReact
                        columnDefs={columns}
                        rowData={rowData3}
                        pagination={true}
                        paginationPageSize={20}
                        suppressBrowserResizeObserver={true}
                        onRowClicked={(row) => navigate(`/MoviePage?ID=${row.data.movID}`)}
                    />
                </div>
            </div>

            <div className='GraphSection'>
                <p className="NameTitle"><b>RATINGS</b></p>
                <hr></hr>

                <div class="chart-container">
                    <canvas id="chart"></canvas>
                </div>


            </div>
            </div>
            }
            

        </div>
    )

}