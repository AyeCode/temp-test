var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable");
var blogListViewModel = require("../../shared/view-models/blog-list-view-model");
var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var page;

var blogList = new blogListViewModel([]);
var pageData = observableModule.fromObject({
    blogList: blogList,
    grocery: ""
});

exports.loaded = function(args) {
    page = args.object;
    var listView = page.getViewById("blogList");

    if (page.ios) {
        swipeDelete.enable(listView, function(index) {
            blogList.delete(index);
        });
    }
    
    page.bindingContext = pageData;

    blogList.empty();
    pageData.set("isLoading", true);
    blogList.load().then(function() {
        pageData.set("isLoading", false);

        // test = blogList.addAuthorImg2();
        // alert(test);
        // console.dump(test);

        //blogList.addAuthorImg();
        // blogList.addAuthorImg2().then(function() {
        //     blogList.jobby();
        //    
        // });

        listView.animate({
            opacity: 1,
            duration: 1000
        });
    });
};

exports.add = function() {
    // Check for empty submissions
    if (pageData.get("grocery").trim() !== "") {
        // Dismiss the keyboard
        page.getViewById("grocery").dismissSoftInput();
        blogList.add(pageData.get("grocery"))
            .catch(function(error) {
                console.log(error);
                dialogsModule.alert({
                    message: "An error occurred while adding an item to your list.",
                    okButtonText: "OK"
                });
            });
        // Empty the input field
        pageData.set("grocery", "");
    } else {
        dialogsModule.alert({
            message: "Enter a grocery item",
            okButtonText: "OK"
        });
    }
};

exports.share = function() {
    var list = [];
    var finalList = "";
    for (var i = 0, size = blogList.length; i < size ; i++) {
        list.push(blogList.getItem(i).name);
    }
    var listString = list.join(", ").trim();
    socialShare.shareText(listString);
};

exports.delete = function(args) {
    var item = args.view.bindingContext;
    var index = blogList.indexOf(item);
    blogList.delete(index);
};