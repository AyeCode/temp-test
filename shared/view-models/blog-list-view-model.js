var config = require("../../shared/config");
var fetchModule = require("fetch");
var authorInfoModel = require("../../shared/utils/get-author-info");
var ObservableArray = require("data/observable-array").ObservableArray;

var jobby = 1234;

function blogListViewModel(items) {

    alert('###'+jobby);
    var viewModel = new ObservableArray(items);
    var authors_arr = new ObservableArray([]);

    authors = new authorInfoModel(authors_arr);

    viewModel.load = function() {
        console.log(123);
        //console.dump(viewModel);
        return fetch(config.apiUrl + "posts", {
            headers: {
                "Authorization": "Bearer " + config.token
            }
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            data.forEach(function(post) {
                viewModel.push({
                    name: post.title.rendered+'asfdasdfas',
                    id: post.id,
                    author_id: post.author,
                    author_img: ''
                });
            });
        }).then(function(response) {
                viewModel.addAuthorImg();
            });

    };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };


    viewModel.addAuthorImg = function(author_id) {

        //alert(viewModel.length);

        viewModel.forEach(function(post) {
            console.dump(post);
            if(post.author_img==''){


               authors.get(post.author_id).then(function(r) {
                   //console.dump(authors);
                   //console.dump(authors.getItem(1));
                   //console.dump(authors_arr);
console.log('#####'+post.author_id);
                   author = authors.getItem(post.author_id);
                   console.dump(author);
                   console.log(author.image);
                   post.author_img = author.image; //THIS SHOULD WORK????

               }).catch(function(error) {
                   console.log(error);
                   dialogsModule
                       .alert({
                           message: "xxUnfortunately we were unable to create your account.",
                           okButtonText: "OK"
                       });
               });


                //console.log(test);
                // console.dump(test);
                // console.dump(authors_arr);
                //post.name = 123;
               //post.author_img = "https://secure.gravatar.com/avatar/e3ef355dd9a03c743615ad68657312ef?s=24&d=mm&r=g";
            }
        });
    };

    viewModel.addAuthorImg2 = function(author_id) {

            //alert(viewModel.length);

            viewModel.forEach(function(post) {
                // if(post.author_img==''){
                //     author = authors.getItem(post.author_id);
                //     post.author_img = author.image;
                //    //post.author_img = "https://secure.gravatar.com/avatar/e3ef355dd9a03c743615ad68657312ef?s=24&d=mm&r=g";
                // }

                //console.dump(authors.getItem(1));
                //console.log('@@@@@@@@'+authors.length);

                //post.author_img = "https://secure.gravatar.com/avatar/e3ef355dd9a03c743615ad68657312ef?s=24&d=mm&r=g";

            });

    };


    viewModel.add = function(grocery) {
        return fetch(config.apiUrl + "Groceries", {
            method: "POST",
            body: JSON.stringify({
                Name: grocery
            }),
            headers: {
                "Authorization": "Bearer " + config.token,
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            viewModel.push({ name: grocery, id: data.Result.Id });
        });
    };

    viewModel.delete = function(index) {
        return fetch(config.apiUrl + "Groceries/" + viewModel.getItem(index).id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + config.token,
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(function() {
            viewModel.splice(index, 1);
        });
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

module.exports = blogListViewModel;