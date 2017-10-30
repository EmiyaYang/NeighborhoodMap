/**
 * Created by 10388 on 2017/10/30.
 */
function initMap() {
    var map = new AMap.Map('container',{
        pitch:75,
        viewMode:'3D',
        resizeEnable: true,
        zoom: 10,
        center: [116.480983, 40.0958],
        mapStyle: 'amap://styles/a12bac1585169ec3b6ed5cb2c10fbc5e'
    });

    var markers = [];

    function addMarkers (data) {
        markers = [];
        for (var i = 0; i < data.length; i++) {
            markers.push(new Marker(data[i]));
        }
        map.add(markers);
    }

    addMarkers(locations);

    // 注册监听事件
    viewModel.searchKey.subscribe(function (newValue) {
        /* do stuff */
        var arr = [];
        for (var i = 0; i < locations.length; i++) {
            if (locations[i].name.search(newValue) !== -1) {
                arr.push(locations[i])
            }
        }
        viewModel.searchedLocations(arr);
        viewModel.ifNone(arr.length === 0);

        map.remove(markers);
        addMarkers(arr);
    });

    // 为单项绑定监听事件
    viewModel.selectMarker = function (e) {
      map.setCenter(new AMap.LngLat(e.position[0], e.position[1]));
    };

    function Marker(location) {
        var marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: location.position,
            animation: 'AMAP_ANIMATION_DROP',
            clickable: true,
            title: location.name
        });

        marker.infoWindow = new AMap.InfoWindow({
            content: '<strong>'+ location.name +'</strong><p class="my-desc">'+ location.desc +'</p>',
            //基点指向marker的头部位置
            offset: new AMap.Pixel(0, -31)
        });

        //marker 点击时打开
        AMap.event.addListener(marker, 'click', function() {
            marker.infoWindow.open(map, marker.getPosition());
        });
        return marker
    }

    //为地图注册click事件获取鼠标点击出的经纬度坐标
    var clickEventListener = map.on('click', function(e) {
        viewModel.lng(e.lnglat.getLng());
        viewModel.lat(e.lnglat.getLat());
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
}