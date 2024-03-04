import React, { useCallback, useMemo } from 'react';
import { AgGridReact } from "ag-grid-react";
import { GridCtrl } from 'ag-grid-community';


import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-alpine.css";



import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import MoviePage from './MoviePage';





const columns = [
    { headerName: "Title", field: "title", flex: 1, },
    { headerName: "Year", field: "year", sortable: true, filter: true, flex: 1 },
    { headerName: "IMDB rating", field: "imdbrating", flex: 1 },
    { headerName: "Rotten Tomatoes", field: "rottentomatoes", flex: 1 },
    { headerName: "Metacritic", field: "metacritic", flex: 1 },
    { headerName: "Rated", field: "rated", flex: 1 }
];

function SearchMovies() {
    const [rowData, setRowData] = useState([]);
    const [searchString, setSearchString] = useState('');
    //console.log("1st", searchString);
    const [yearString, setYearString] = useState('')
    const [pageNumber, setPageNumber] = useState(1);
    const navigate = useNavigate();
    const [error, setError] = useState();
    const [errorYear, setErrorYear] = useState();
    const [gridApi, setGridApi] = useState();
    const [dataSource, setDataSource] = useState()

    const {movieURL} = require('../URL/apiURL')

    
    // Function to change state and redirect to MovieSearch
    const UpdateSearchQuery = () => {
        setSearchString((string) => {
            string = document.getElementById('movieString').value;
            return string;
        });
        setYearString((string) => {
            string = document.getElementById('yearString').value;
            return string;

        });
        setPageNumber(1);
        if (document.getElementById('movieString').value || document.getElementById('yearString').value) {
        navigate(`/MovieSearch?title=${document.getElementById('movieString').value}&year=${document.getElementById('yearString').value}`)
        }
            
        
    }
    

    useEffect(() => {
        // Infinite scroll
        let datasource = { 
                    getRows(params) {
                        let searchString2 = document.getElementById('movieString').value;
                        let yearString2 = document.getElementById('yearString').value;
                        //console.log(JSON.stringify(params, null, 1));
                        console.log("Fetching more...")
                        
                        let page2  = (params.endRow/100)
                        let url = `${movieURL}?title=${searchString2}&year=${yearString2}&`
                        url += `page=${page2}`
                        console.log("Fetching page ", page2)
                        fetch(url)
                            .then(httpResponse => {
                                if (httpResponse.status == 429) {
                                    setError("Too many requests. \n Please try again later")
                                } else {
                                    setError();
                                    return httpResponse.json()
                                }
                                
                            })
                            .then((data) => data.data)
                            .then((movies) =>
                            movies.map((movie) => ({
                                title: movie.title,
                                year: movie.year,
                                imdbrating: movie.imdbRating,
                                rottentomatoes: movie.rottenTomatoesRating,
                                metacritic: movie.metacriticRating,
                                rated: movie.classification,
                                imdbID: movie.imdbID
                            }))
                        )
                        .then((movies) => {
                            params.successCallback(movies);
                            
                        })
                        .catch((e) => {
                            console.log(e);
                        })
                    }
                };
                
                setDataSource(datasource);

                let onGridReady = (params) => {
                    
                    params.api.setDatasource(dataSource);
                    
                }
            
                setGridApi(onGridReady.toString())
                

            
    }, [searchString, yearString, pageNumber]);


    //console.log("Data Source:", dataSource)
    //console.log("Grid Api: ",gridApi);


    return (
        <div className='MovieSection'>
            
            <div className='SearchArea'>
                <form className='SearchBoxes'>
                    
                    <input type='text' id='movieString' placeholder='Search Movie Name Here' className='searchBar' />
                    <input type="number" id='yearString' min="1990" max="2023" placeholder='Year' className='searchBar' />
                    <input type="button" onClick={UpdateSearchQuery} value="Search" className='SearchButton' />
                    
                </form>
                {errorYear != null ? <p className='ErrorMessageMovie'>{errorYear}</p> : null}
            </div>
            <div className='TableArea'>
                    {
                        error != null ? <h1 style={{height: '500px'}}>{error}</h1> : 
                        <div id="MainTable" className="ag-theme-alpine" style={{ height: '600px', width: "100%" }}>
                    <AgGridReact
                        columnDefs={columns}
                        rowModelType="infinite"
                        onGridReady={eval(gridApi)}
                        suppressBrowserResizeObserver={true}
                        onRowClicked={(row) => navigate(`/MoviePage?ID=${row.data.imdbID}`)}    
                    />
                </div> 
                    }
                
            </div>

        </div>
    )
}



export default function Movies() {
    return (

        <div>
            <SearchMovies />
        </div>


    )
}