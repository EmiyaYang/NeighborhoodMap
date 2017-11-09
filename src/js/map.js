/**
 * Created by 10388 on 2017/10/30.
 */
function initMap() {
    var map = new AMap.Map('container', {
        pitch: 75,
        viewMode: '3D',
        resizeEnable: true,
        zoom: 10,
        center: [116.480983, 40.0958],
        mapStyle: 'amap://styles/a12bac1585169ec3b6ed5cb2c10fbc5e'
    });

    var markers = [];
    var shownMarkers = [];

    // for (var i in locations) {
    //     setWeather(locations[i])
    // }

    (function addMarkers(locations) {
        markers = [];

        for (var i = 0; i < locations.length; i++) {
            markers.push(new Marker(locations[i]));
            shownMarkers.push(new Marker(locations[i]));
        }
        map.add(markers);
    })(locations);

    // 根据给定的索引数组设置marker集合的可见性
    function renewMarkers(arr) {
        shownMarkers = [];
        for (var i in markers) {
            markers[i].hide()
        }
        for (var i in arr) {
            markers[arr[i]].show()
            shownMarkers.push(markers[arr[i]])
        }
    }

    // 注册监听事件
    viewModel.searchKey.subscribe(function (newValue) {
        /* do stuff */
        var arr = [];
        var tempLoactions = []
        for (var i = 0; i < locations.length; i++) {
            if (locations[i].name.search(newValue) !== -1) {
                arr.push(i)
                tempLoactions.push(locations[i])
            }
        }
        viewModel.searchedLocations(tempLoactions);
        viewModel.ifNone(arr.length === 0);

        renewMarkers(arr)
    });

    // 为单项绑定监听事件
    viewModel.selectMarker = function ($index, data) {
        map.setCenter(new AMap.LngLat(data.position[0], data.position[1]));
        AMap.event.trigger(shownMarkers[$index()], 'click')
    };

    function Marker(location) {
        var marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: location.position,
            animation: 'AMAP_ANIMATION_DROP',
            clickable: true,
            title: location.name
        });

        setWeather(location, function () {
            marker.infoWindow = new AMap.InfoWindow({
                content: '<strong>' + location.name + '</strong><p class="my-desc">' + location.desc + '</p><p>'+ location.weather.weather +'</p>',
                //基点指向marker的头部位置
                offset: new AMap.Pixel(0, -31)
            });
        });

        marker.on('click', function () {
            marker.infoWindow.open(map, marker.getPosition());
        });
        return marker
    }

    //为地图注册click事件获取鼠标点击出的经纬度坐标
    var clickEventListener = map.on('click', function (e) {
        viewModel.lng(e.lnglat.getLng());
        viewModel.lat(e.lnglat.getLat());
        regeocoder([e.lnglat.getLng(), e.lnglat.getLat()])
        // document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()

    });
    var auto = new AMap.Autocomplete({
        input: "tipinput"
    });
    AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
    function select(e) {
        if (e.poi && e.poi.location) {
            map.setZoom(15);
            map.setCenter(e.poi.location);
        }
    }

    function regeocoder(lnglatXY) {  //逆地理编码
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        geocoder.getAddress(lnglatXY, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result);
            }
        });
        // var marker = new AMap.Marker({  //加点
        //     map: map,
        //     position: lnglatXY
        // });
        // map.setFitView();
    }

    function geocoder_CallBack(data) {
        var address = data.regeocode.formattedAddress; //返回地址描述
        viewModel.address(address)
        // document.getElementById("result").innerHTML = address;
    }
}