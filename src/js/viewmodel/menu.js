/**
 * Created by 10388 on 2017/10/30.
 */
var viewModel = {
    searchedLocations: ko.observableArray(locations),
    ifNone: ko.observable(false),
    searchKey: ko.observable(null),
    lng: ko.observable(0),
    lat: ko.observable(0),
    selectMarker: function (e) {
        alert(e.name);
    }
};

ko.applyBindings(viewModel); // 注意：ko. applyBindings需要在上述HTML之后应用才有效