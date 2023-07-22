/**
 * @license MIT
 * @copyright aniSharma 2023 All rights reserved
 * @author codewithsadee <anis42390@gmail.com>
 */

'use strict';

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 * Add event listener on multiple elements
 * @param {NodeList} elements Elements node array
 * @param {string} eventType Event Type e.g.. "click", "mouseover"
 * @param {function} callback callback function
 */
const addEventOnElements = function (elements, eventType, callback) {
    for (const element of elements) element.addEventListener(eventType, callback);
}

/**
 * Toggle search in mobile devices
 */
const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);


/**
 * SEARCH INTEGRATION
 */

const searchfield = document.querySelector("[data-search-field]");

const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchfield.addEventListener("input", function () {
    searchTimeout ?? clearTimeout(searchTimeout);
    if (!searchfield.value) {
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchfield.classList.remove("searching");
    } else {
        searchfield.classList.add("searching");
    }
    if (searchfield.value) {
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchfield.value), function (locations) {
                searchfield.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `<ul class="view-list" data-search-list></ul>
            `;

                const /** {NodeList} | [] */ items = [];

                for (const { name, lat, lon, country, state } of locations) {
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");

                    searchItem.innerHTML = `
                    <span class="m-icon">location_on</span>

                    <div>
                        <p class="item-title">${name}</p>
                        <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                    </div>

                    <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
                
                `;
                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"));
                }
            });

        }, searchTimeoutDuration);
    }
});

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");

/**
 * Render all weather data in html page
 * 
 * @param {number} lat latitude
 * @param {number} lon longitude
 */

export const updateWeather = function (lat, lon) {
    loading.computedStyleMap.display = "grid";
    container.style.overflow = "hidden";
    container.classList.contains("fade-in") ?? container.classList.remove("fade-in");

    errorContent.style.display = "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const hourlySection = document.querySelector("[data-hourly-forecast]");
    const forecastSection = document.querySelector("[data-5-day-forecast]");

    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";

    if (window.location.hash === "#/current-location") {
        currentLocationBtn.setAttribute("disabled", "");
    } else {
        currentLocationBtn.removeAttribute("disabled");
    }

    /**
     * Current Weather Section
     */
    fetchData(url.currentWeather(lat, lon), function (currentWeather) {
        const {
            weather,
            dt: dateUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
            main: { temp, feels_like, pressure, humidity },
            visiblity,
            timezone
        } = currentWeather
        const [{ description, icon }] = weather;
    });

}