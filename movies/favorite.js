const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const dataPanel = document.querySelector('#data-pannel')
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
//function
function renderMovieList(data) {
  let rawHTML = ''
  //processing 
  for (let movie of data) {
    rawHTML += `      
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + movie.image}"
              class="movie-img-top" alt="movie poster">
            <div class="card-body">
              <h5 class="movie-tite">${movie.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-id="${movie.id}"
                data-target="#movie-modal">More</button>
              <button class="btn btn-danger delete" data-toggle="modal" data-id="${movie.id}">X</button>
            </div>
          </div>
        </div>
      </div>`
  }
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const MovieData = response.data.results
    modalTitle.innerText = MovieData.title
    modalDate.innerText = 'Release date: ' + MovieData.release_date
    modalDescription.innerText = MovieData.description
    modalImage.innerHTML = `<img src="${POSTER_URL + MovieData.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function removeFromFavorite(id) {
  if (!movies) return
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return
  movies.splice(movieIndex,1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}
//processing

renderMovieList(movies)

dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.delete')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})


