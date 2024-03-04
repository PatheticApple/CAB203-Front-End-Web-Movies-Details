import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import PeoplePage from './PeoplePage';

// Bearker token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhcnlAZ21haWwuY29tIiwiZXhwIjoxNjgxMzI2ODg5LCJpYXQiOjE2ODEzMjYyODl9.3jnCE8gdp9LbCH2ShNxziIz8gfjeflIa2UOYwmlW8HU'
const columns = [
    { headerName: "Role", field: "role", flex: 1 },
    { headerName: "Name", field: "name", sortable: true, filter: true, flex: 1 },
    { headerName: "Character", field: "character", flex: 1 },

];



export default function MoviePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const ID = searchParams.get("ID");
    const [releasedYear, setReleaseYear] = useState();
    const [title, setTitle] = useState();
    const [runTime, setRunTime] = useState();
    const [genres, setGenres] = useState();
    const [country, setCountry] = useState();
    const [boxoffice, setBoxoffice] = useState();
    const [plot, setPlot] = useState();
    const [rowData2, setRowData2] = useState([]);
    const [internetMovieDatabase, setInternetMovieDatabase] = useState();
    const [rottenTomatoes, setRottenTomatoes] = useState();
    const [metacritic, setMetacritic] = useState();
    const [poster, setPoster] = useState();
    const [error, setError] = useState();

    const {movieData} = require('../URL/apiURL')
    
    useEffect(() => {
        (async () => {
            let res = await fetch(`${movieData}${ID}`); // Fetch Movie Data
            console.log(res.status);
            let data = await res.json();
            let principals2 = () => {
                if (res.status == 404) { // If Movie ID doesn't exist
                    setError("Error 404: Movie not found")
                }
                else if (res.status == 400) { // If year parameter is passed
                    setError("400, Year Parameters are not permitted")
                }
                else if (res.status == 429) { // If timed out
                    setError("Too many requests. \n Please try again later")
                }
                else {
                    return data.principals;
                }
            }
            //console.log(data);
            let principals = principals2();

            //console.log(principals);
            let casts = principals.map((cast) => ({
                role: cast.category,
                name: cast.name,
                character: cast.characters,
                id: cast.id

            }));
            setTitle(data.title);
            setRunTime(data.runtime);
            setReleaseYear(data.year);

            // Function to display genres
            const newGenres = data.genres.map((element) => {
                if (element == 'Comedy') {
                    return (
                        <><span className="badge" style={{ "backgroundColor": 'green' }}>{element}</span> </>
                    )
                }
                else if (element == 'Drama') {
                    return (
                        <><span className="badge" style={{ "backgroundColor": 'orange' }}>{element}</span> </>
                    )
                }
                else if (element == 'Romance') {
                    return (
                        <><span className="badge" style={{ "backgroundColor": 'purple' }}>{element}</span> </>
                    )
                }
                else if (element == 'Fantasy') {
                    return (
                        <><span className="badge" style={{ "backgroundColor": 'blue' }}>{element}</span> </>
                    )
                }
                else if (element == 'Action') {
                    return (
                        <><span className="badge" style={{ "backgroundColor": 'red' }}>{element}</span> </>
                    )
                }
                else if (element == 'Crime') {
                    return (
                        <><span className="badge" style={{ "backgroundColor": 'black' }}>{element}</span> </>
                    )
                }
                else {
                    return (
                        <><span className="badge">{element}</span> </>
                    )
                }

            })
            setGenres(newGenres);

            setCountry(data.country);
            setBoxoffice(data.boxoffice);
            setPlot(data.plot);
            setRowData2(casts);
            setInternetMovieDatabase(data.ratings[0].value);
            setRottenTomatoes(data.ratings[1].value);
            setMetacritic(data.ratings[2].value);
            setPoster(data.poster);



            
        })();
    }, [ID]);

  
    // Function to display ratings in badges form
    function DisplayIMDB() {
        if (internetMovieDatabase) {
            return (
                <div className='EachRating'>
                    <h2>IMDB</h2>
                    <span className="badge2" style={{ backgroundColor: "#DEB522" }}>{internetMovieDatabase}/10</span>
                </div>
            )
        }
    }

    function DisplayTomato() {
        if (rottenTomatoes) {
            return (
                <div className='EachRating'>
                    <h2>Rotten Tomatoes</h2>
                    <span className="badge2" style={{ backgroundColor: "#A94242" }}>{rottenTomatoes}%</span>
                </div>
            )
        }
    };

    function DisplayMeta() {
        if (metacritic) {
            return (
                <div className='EachRating'>
                    <h2>Metacritic</h2>
                    <span className="badge2" style={{ backgroundColor: "#FFCE35" }}>{metacritic}/100</span>
                </div>
            )
        }
    }
    // console.log(listGenres);
    return (
        <div className='MovieSection'>
            {error != null ?
                <div style={{ height: '750px' }}>
                    <h1 >{error}</h1>
                </div>

                :
                <div className='InfoSection'>
                    <div className='Informations'>
                        <h1 className="MovieTitle">{title}</h1>
                        <hr></hr>
                        <p>Released In: <b>{releasedYear}</b> </p>
                        <p>Runtime: <b>{runTime}</b></p>
                        <p>Genres: {genres}</p>
                        <p>Country: <b>{country}</b></p>
                        <p>Box Office: <b>${boxoffice}</b></p>
                        <p>Plot: <b>{plot}</b></p>

                        <div className='CastTableSection'>
                            <div id="castTable" className="ag-theme-alpine" style={{ height: '500px', width: "100%" }}>
                                <AgGridReact
                                    columnDefs={columns}
                                    rowData={rowData2}
                                    pagination={true}
                                    paginationPageSize={10}
                                    suppressBrowserResizeObserver={true}
                                    onRowClicked={(row) => navigate(`/PeoplePage?ID=${row.data.id}`)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='ImageSection'>
                        <div className='RatingArea'>
                            <DisplayIMDB />
                            <DisplayTomato />
                            <DisplayMeta />
                        </div>
                        <img src={poster} style={{color: "white"}} alt={title + "'s Poster"}></img>

                    </div>
                </div>
            }



            {/* <p>ID: {ID}</p> */}

        </div>
    )
}