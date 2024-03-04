
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";







const columns = [
    { headerName: "Title", field: "title", flex: 1, },
    { headerName: "Year", field: "year", sortable: true, filter: 'agNumberColumnFilter', flex: 1 },
    { headerName: "IMDB rating", field: "imdbrating", flex: 1, sortable: true, filter: 'agNumberColumnFilter' },
    { headerName: "Rotten Tomatoes", field: "rottentomatoes",sortable: true, flex: 1, filter: 'agNumberColumnFilter' },
    { headerName: "Metacritic", field: "metacritic", flex: 1, sortable: true, filter: 'agNumberColumnFilter' },
    { headerName: "Rated", field: "rated", flex: 1, filter: true }
];

function SearchMovies2() {

    const [searchParams] = useSearchParams();
    const title = searchParams.get("title");
    console.log("Title:", title);
    const year = searchParams.get("year");
    console.log("Year:", year);

    const [rowData, setRowData] = useState([]);
    const [searchString, setSearchString] = useState(title);
    const [yearString, setYearString] = useState(year)
    const [pageNumber, setPageNumber] = useState(1);
    const navigate = useNavigate();
    const [error, setError] = useState();
    const [errorYear, setErrorYear] = useState();
    const [theFirst, setTheFirst] = useState();
    const [resultCount, setResultCount] = useState()
    const [pageNeed, setPageNeed] = useState(false);

    
    
    const {movieURL} = require('../URL/apiURL')

    // Function to increment/decrement page number depend on the buttons
    const incrementPageNumber = () => {
        setPageNumber((oldPageNumber) => oldPageNumber + 1);
        setPageNeed(true);
    };

    const decrementPageNumber = () => {
        if (pageNumber != 1) {
            setPageNumber((oldPageNumber) => oldPageNumber - 1);
        }
        setPageNeed(true);
    };

    // Function to update state from the inputs
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
        // If inputs are empty, redirect back to Movies Page
        if (!document.getElementById('movieString').value && !document.getElementById('yearString').value) {
            navigate(`/Movies`)
        } else {
            navigate(`/MovieSearch?title=${document.getElementById('movieString').value}&year=${document.getElementById('yearString').value}`)
        }
    }




    useEffect(() => {

        fetch(`${movieURL}?title=${searchString}&year=${yearString}&page=${pageNumber}`)
            .then((data) => {
                console.log(data.status);
                if (data.status == 400) { // If Year input is in invalid format
                    setError("400, Invalid Year Format");
                    document.getElementById("yearString").style.borderColor="yellow";
                    document.getElementById("yearString").style.boxShadow="0 0 20px yellow"
                    setErrorYear("Invalid Year Format, Year String must by YYYY")
                }
                else if (data.status == 429) { // If timed out
                    setError("429, Please Try Again Later");
                }
                else {
                    setError();
                    document.getElementById("yearString").style.borderColor="#FF4150";
                    document.getElementById("yearString").style.boxShadow="0 0 10px #FF4150"
                    setErrorYear();
                    return data.json();
                    
                }
            })
            .then((data) => data.data)
            .then((movies) => {
                console.log(movies.length);
                setResultCount(movies.length);
                if (movies.length == 100) {
                    setPageNeed(true);
                    setTheFirst('the first')
                } else {
                    setTheFirst()
                }
                return movies.map((movie) => ({
                    title: movie.title,
                    year: movie.year,
                    imdbrating: movie.imdbRating,
                    rottentomatoes: movie.rottenTomatoesRating,
                    metacritic: movie.metacriticRating,
                    rated: movie.classification,
                    imdbID: movie.imdbID
                }))
                
    })
            .then((movies) => {
                setRowData(movies);
                //console.log(movies);
            })
            .catch((e) => {
                console.log(e);
            })
    }, [searchString, yearString, pageNumber, pageNeed]);


    return (
        <div className='MovieSection'>
            {/* <h3> {error}</h3> */}
            <div className='SearchArea'>
                <form className='SearchBoxes'>
                    {/* <label htmlFor='MovieName'>Movie Name</label><br /> */}
                    <input type='text' id='movieString' placeholder={title} className='searchBar' />
                    <input type="number" id='yearString' min="1990" max="2023" placeholder={year} className='searchBar' />
                    <input type="button" onClick={UpdateSearchQuery} value="Search" className='SearchButton' />
                </form>
                {pageNeed == true ? 
                <div className='SearchPageNo'>
                    <p className='PageNumber'>Pages:</p>
                    <button id="PrevPage" className="SearchButton" onClick={decrementPageNumber}>&lt;</button>
                    <p className='PageNumber'>{pageNumber}</p>
                    <button id="NextPage" className="SearchButton" onClick={incrementPageNumber}>&gt;</button>
                </div>
                : false}

                {errorYear != null ? <p className='ErrorMessageMovie'>{errorYear}</p> : null}
            </div>
            <div className='TableArea'>
                

                {
                        error != null ? <h1 style={{height: '500px'}}>{error}</h1> : 
                        <div>
                            <p className='ShowingResults'>Showing {theFirst} <b>{resultCount}</b> results from 
                
                
                {searchString != null ? <b><i> {searchString}</i></b> : null}
                
                {yearString != null ? <b><i> {yearString}</i></b> : null}
                
                </p>
                        <div id="MainTable" className="ag-theme-alpine" style={{ height: '600px', width: "100%" }}>
                    <AgGridReact
                        columnDefs={columns}
                        rowData={rowData}
                        //pagination={true}
                        paginationPageSize={20}
                        suppressBrowserResizeObserver={true}
                        onRowClicked={(row) => navigate(`/MoviePage?ID=${row.data.imdbID}`)}
                        
                    />

                </div>
                    </div>    
                }
                
            </div>


        </div>
    )
}



export default function Movies() {
    return (

        <div>
            <SearchMovies2 />
        </div>


    )
}