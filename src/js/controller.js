// API Link
// https://forkify-api.herokuapp.com/v2
'use strict';

// Own modules
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// 3rd party modules
import 'core-js/stable'; //For polyfiling rest of JS code
import 'regenerator-runtime/runtime'; //For polyfiling async/await

if (module.hot) {
  module.hot.accept();
}

// 288. Loading a Recipe from API:
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; //Guard clause

    recipeView.renderSpinner();

    //1)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //2)Updating bookmarks view
    // debugger; !******************************
    bookmarksView.update(model.state.bookmarks);

    //3)Loading Recipe
    await model.loadRecipe(id); //loadRecipe is an async function, so it'll return a promise, so here we have to await that promise inside this async function.(Situation: async func. calling another async func.)     *****important!

    //289. Rendering the Recipe:
    //4)Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1)Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2)Load search results
    await model.loadSearchResults(query);

    //3)Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4)Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1)Render new results
  //resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2)Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (In state)
  model.updateServings(newServings);

  // Update the recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddbookmark = function () {
  // 1)Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);

  // 2)Update recipe view
  recipeView.update(model.state.recipe);

  // 3)Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // console.log(newRecipe);
    //Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //window.history, so i.e. the history API of the browsers. On this history object,we can call the pushState method. This will allow us to change the URL WITHOUT RELOADING the page. pushState takes three arguments first one  is state which doesn't really matter. U can just specify null. Second one is title which is actually not relevant, we can just use an empty string. Important is the third one, because this one is actually the URL, so here we can simply put the hash & then the ID that we want to put onto the URL.So that is @model.state.recipe.id. We could also do all kinds of other stuff with the history API, like for example going back and forth just as if we were clicking the forward and back buttons in the browser. So automatically going back to the last page.

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddbookmark);
  searchView.addhandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
