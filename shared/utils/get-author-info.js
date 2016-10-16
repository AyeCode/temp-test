var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray= require("data/observable-array").ObservableArray;

var authors = new ObservableArray([]);

function authorInfoModel(authors) {
    var viewModel = new ObservableArray(authors);

    viewModel.get = function(author_id) {
        
        return fetch(config.apiUrl + "users/1", {
            headers: {
                "Authorization": "Bearer " + config.token
            }
        })
            .then(handleErrors)
            .then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log('aaaa');
                //console.dump(data);
                viewModel.setItem(data.id,{
                    id: data.id,
                    name: data.name,
                    url: data.url,
                    description: data.description,
                    image: data.avatar_urls["24"] // 24,48,96
                });

                // viewModel.push({
                //     id: data.id,
                //     name: data.name,
                //     url: data.url,
                //     description: data.description,
                //     image: data.avatar_urls["48"] // 24,48,96
                // });
                //console.dump(authors);

            });
    };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };


    return viewModel;
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = authorInfoModel;