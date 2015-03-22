function statmap(){
  var comname = $("#com_name").val()
  var comurl = $("#com_url").val()
  var comaddress = $("#com_address").val()
  host = "http://maps.googleapis.com/maps/api/staticmap"
  opt = "?center=" + comaddress + "&zoom=14&size=400x400&sensor=false" + "&markers=" + comaddress
  url = host + opt
  console.log(url)
  $.ajax({
    type: 'GET',
    url: url,
    success: function(png){
      $("#statmap").children("img").attr({'src':url,'width':640,'height':300});
    }
  });
}


function register(){
  var comname = $("#com_name").val()
  var comurl = $("#com_url").val()
  var comaddress = $("#com_address").val()
  host = "http://maps.googleapis.com/maps/api/geocode/json"
  opt = "?address=" + comaddress + "&sensor=true_or_false"
  url = host + opt
  console.log(url)
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    success: function(json){
      lat = json.results[0].geometry.location.lat
      lng = json.results[0].geometry.location.lng
      console.log(lat + ',' + lng)
      api_request = {
        "name": comname,
        "url": comurl,
        "address": comaddress,
        "latlng": lat + ',' + lng
      }
      console.log(api_request)
      var host = "http://localhost:8088/"
      var opt = "api/v1/startmaps"
      var posturl = host + opt
      console.log(["post:startmaps:", posturl]);
      $.post(posturl,
        api_request,
        function(data){
          alert("Data Loaded: " + data);
        }
      )
    }
  });
}
