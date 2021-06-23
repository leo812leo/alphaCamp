const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filteredMovies = []
const dataPanel = document.querySelector('#data-pannel')
const searchForm = document.querySelector('#search-form')
const paginator = document.querySelector('#paginator')
const MOVIES_PER_PAGE = 12
let cardView = true
const icons = document.querySelector("#icons")
let page = 1

function renderMovieList(data) {
  let rawHTML = ''
  //processing 
  if (cardView) {
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
                <button class="btn btn-info btn-add-favorite" data-toggle="modal" data-id="${movie.id}">+</button>
              </div>
            </div>
          </div>
        </div>`
    }
  } else {
    for (let movie of data) {
      rawHTML += `
            <table class="table">
              <tbody>
                <tr>
                  <td class="d-flex justify-content-between">
  <span class="d-flex align-items-center">
                    <h2 class="ml-5">${movie.title}</h2></span>

                    <div class="cardButton">
                                    <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-id="${movie.id}"
                  data-target="#movie-modal">More</button>
                      <button data-id="${movie.id}" class="btn btn-secondary btn-add-favorite btn-info">+</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>  
          `
    }
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  if (list.some((movie) => movie.id === id)) {
    alert('此電影已經在收藏清單中！')
  } else {
    const movie = movies.find((movie) => movie.id === id)
    list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }
}

function getMoviesByPage(page) {
  //計算起始 index 
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages ; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

//動作
axios.get(INDEX_URL).then(function (response) {
  movies.push(...response.data.results)
  renderMovieList(getMoviesByPage(1))
  renderPaginator(movies.length)
})



dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function searchFormSubmitted(event) {
  event.preventDefault() 
  const keyWord = document.querySelector('#search-input').value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyWord))
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyWord} 沒有符合條件的電影`)
  }
  else {
    renderPaginator(filteredMovies.length)
    renderMovieList(getMoviesByPage(1))
  }
})


paginator.addEventListener('click', function onPaginatorClickes(event) {
  if (event.target.tagName !== 'A') return
  page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

icons.addEventListener("click", (event) => {
  console.log('click')
  if (event.target.matches(".fa-th")) {
    cardView = true
  } else if (event.target.matches(".fa-bars")) {
    cardView = false
  }
  renderMovieList(getMoviesByPage(page))
  const data = filteredMovies.length ? filteredMovies : movies
  renderPaginator(data.length)
})