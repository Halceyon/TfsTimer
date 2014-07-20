var app = {
    version: 1.0,
    helpers: {
        web: {
            get: function(url, callback) {
                $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: url,
                    crossDomain: true,
                    dataType: "json",
                    async: false,
                    data: {},
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', "Basic " + localStorage.getItem('Auth'));
                    },
                    success: function(results) {
                        console.log(results);
                        callback(results);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                    }
                });
            }
        }
    },
    model: function () {
        var self = this;
        self.projects = ko.observableArray();
        self.selectedProject = ko.observable();
        self.sortedProjects = ko.computed(function () {
            return self.projects.sortBy(function (item) {
                return item.Name;
            });
        });
        self.selectedProject.subscribe(function () {
            var project = self.selectedProject();
            console.log(project.WorkItems.__deferred.uri);
            app.helpers.web.get(project.WorkItems.__deferred.uri + '?$format=json', function (data) {
                self.workItems(data.d.results);
            });
        })
        self.workItems = ko.observableArray();
        self.selectedWorkItem = ko.observable();
        self.sortedWorkItems = ko.computed(function () {
            if (self.workItems()) {
                var workItems = self.workItems();
                var result = _.sortBy(workItems, function (item) {
                    return item.Title;
                });
                return result;
            }
        });
        self.hours = ko.observable();
        self.save = function() {
            alert('Saved!');
        };
    }
};

if (localStorage.getItem('Auth')) {
    //$.ajaxSetup({
    //    headers: { 'Authorization': "Basic " + localStorage.getItem('Auth') }
    //});
} else {
    alert('No credentials found, please use the extension options to set the credentials');
}
var viewModel = new app.model();
ko.applyBindings(viewModel);
console.log('model loaded');
var url = 'https://tfsodata.visualstudio.com/DefaultCollection/Projects?$format=json';

app.helpers.web.get(url, function (data) {
    viewModel.projects(data.d.results);
})