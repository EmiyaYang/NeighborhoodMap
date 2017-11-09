/**
 * Created by 10388 on 2017/11/9.
 */
/**
 * 调用高德地图的api，通过城区编号获取天气信息
 * @param location
 * @param callback
 */
function setWeather(location, callback) {
    $.ajax({
        url: 'http://restapi.amap.com/v3/weather/weatherInfo?key=38b18d8b6a65fa654baf30409f0be290&city=' + location.cityCode,
        method: 'GET',
        success: function (data) {
            location.weather = data.lives[0];
            callback();
        },
        error: function () {
            location.weather = "无法获取天气信息";
            callback();
        }

    })
}

