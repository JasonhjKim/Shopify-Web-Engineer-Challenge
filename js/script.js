console.log("Js has been loaded")

const form = document.querySelector(".search-wrapper");
const favourite = [];

form.addEventListener('submit', function(event) {
    const APILINK = "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000"
    const input = document.querySelector(".search"); 
    const text = document.querySelector(".search").value;
    event.preventDefault();

    var request = new XMLHttpRequest();
    request.open('GET', APILINK, true);
    request.onload = function() {
        var data = JSON.parse(request.response);
        console.log(data);
        const foundResult = search(text, data);
        const parsedResult = createList(foundResult);
        const checkedResult = checkAlreadyFavorited(parsedResult)
        console.log(parsedResult);
        loadResult(checkedResult);
    }
    form.onready = input.blur();
    request.send();
})

var iffe = (function() {
    console.log("IIFE getting called?")
    const result = document.querySelector('.result');
    const fav = document.querySelector('.favourite');
    const search = document.querySelector('.search');
    const p = document.createElement('p');
        p.innerHTML = "Search for keyword (e.g. Garbage, Takeout, Furniture...)"
        p.classList.add('hint')

    if(result.childElementCount <= 0) {
        result.appendChild(p);
    }

    if (fav.childElementCount <= 0) {
        const favP = document.createElement('p');
        favP.innerHTML = "You have not added any favourite"
        favP.classList.add('hint')
        fav.appendChild(favP);
    }

    search.addEventListener('input', function() {
        if(search.value === "") {
            removeAllChildNode(result);
            if(result.childElementCount <= 0) {
                result.appendChild(p);
            }
        }
    })
})();


/**
 * Takes user input (keyword) to search through the dataset
 * @param {String} keyword
 * @param {Array}  dataset
 * @return {Array}
 */

var search = function(keyword, dataset) {
    var returnArr = [];
    if (keyword.length > 0) {
        dataset.map((element, index) => {
            if (element.keywords.indexOf(keyword) !== -1) {
                returnArr.push(element)        
            } else {
                console.log("not found");
            }
        })
    } else {
        return false;
    }
    return returnArr;
}

/**
 * Takes array of items that user has searched to create a list
 * @param {Array} dataset
 * @return {Array}
 */

var createList = function(dataset) {
    const returnArr = [];
    for(var i = dataset.length - 1; i >= 0; i--) {
        var li = document.createElement('li');
        li.className = "item"
        li.innerHTML =
            '<div class="result-title-container">' +
                '<img class="star" src="../star.svg" width="15px" height="15px" onClick="addFavourite(this)">' + 
                "<div>" + convertHTML(dataset[i].title) + "</div>" +
            '</div>' +
            '<div class="result-body-container">' +
                convertHTML(dataset[i].body) +
            '</div>'

        returnArr.push(li);
        // result.appendChild(li);
    }
    console.log(returnArr);
    return returnArr;
}

/**
 * Takes string of html and converts it to html with valid tags
 * @param {String} html
 * @return {String}
 */
var convertHTML = function(html) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value
}

/**
 * Appends reuslt to the view for the user.
 * @param {Array} results
 */
var loadResult = function(results) {
    const result = document.querySelector('.result');
    if (result.childElementCount > 0) {
        removeAllChildNode(result);
    }
    console.log(results);
    for (var item in results) {
        result.appendChild(results[item].cloneNode(true));
        // result.appendChild(item.node);
    }
}

/**
 * Add/remove favourite Node
 * @param {Node} selected 
 */

var addFavourite = function(selected) {
    const parent = selected.parentElement.parentElement.cloneNode(true);
    if (selected.classList.contains('selected')) {
        const index = getIndex(parent);
        console.log("does this get called?");
        selected.classList.remove('selected')
        favourite.splice(index, 1);
    } else {
        selected.classList.add('selected')
        parent.firstChild.querySelector("img").classList.add('selected');
        // console.log(parent.firstChild.querySelector("img").classList)
        favourite.push(parent);
    }

    loadFavourite()
}

/**
 * Get index of current favourited node
 * @param {Node} node
 */

var getIndex = function(node) {
    for (var i = 0; i < favourite.length; i++) {
        if (favourite[i].innerText === node.innerText) {
            return i;
        }
    }
    return -1;
}

/**
 * Reset Favourite section when new event triggered
 */

var loadFavourite = function() {
    console.log(favourite);
    const fav = document.querySelector('.favourite');
    if (fav.childElementCount > 0) {
        removeAllChildNode(fav);
    }
    for (var item in favourite) {
        console.log(favourite[item].firstChild.querySelector('img').classList);
        fav.appendChild(favourite[item].cloneNode(true));
    }
}

/**
 * Remove all children nodes from a parent node.
 * @param {Node} parent 
 */

var removeAllChildNode = function(parent) {
    var fn = parent.firstChild
        while(fn) {
            parent.removeChild(fn);
            fn = parent.firstChild;
        }
}

/**
 * Check if any of the current result contain favourited items.
 * @param {Array} results 
 * @return {Array}
 */

var checkAlreadyFavorited = function(results) {
    for(var i = 0; i < favourite.length; i++) {
        for (var j = 0; j < results.length; j++) {
            if (favourite[i].innerText === results[j].innerText) {
                results[i].firstChild.querySelector('img').classList.add('selected');
                console.log(star);
                console.log("found");
            }
        }
    }
    return results;
}