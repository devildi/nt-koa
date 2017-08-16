var map
var pos
var userData
var isiPhone = navigator.userAgent.toLocaleLowerCase().match(/iPhone/i)
var thisMarker
var point = {}
var line = []
var play = []
var dinner = []
var hotel = []
var timer
var continuousPositioning = false
var userdata = {
    play: [
    [{
      nameOfScene:'巴黎圣母院',
      des:'寻觅钟楼怪人，巴黎最古老的天主教堂/8欧/10:30-18:30/1h',
      location:{lat: 48.85291970657539, lng: 2.349676787853241}
    },
    {
      nameOfScene:'卢浮宫',
      des:'世界三大博物馆之一，《断臂维纳斯》《胜利女神像》《蒙娜丽莎》三大镇宅之宝！/12欧',
      location:{lat: 48.86067750938799, lng: 2.334122657775879}
    },
    {
      nameOfScene:'杜乐丽花园',
      des:'连接卢浮宫和协和广场，宜小做休整！',
      location:{lat: 48.863020028820706, lng: 2.326744042358415}
    },
    {
      nameOfScene:'协和广场',
      des:'拿破仑从埃及运回高高的方尖碑矗立于此',
      location:{lat: 48.86498, lng: 2.3218500000000404}
    },
    {
      nameOfScene: '香榭丽舍大道',
      des: '即使不买买买，依然值得逛逛逛！',
      location:{lat: 48.86945833854196, lng: 2.3076782151222286}
    },
    {
      nameOfScene: '雄狮凯旋门',
      des: '大巴黎的地标，必去无疑！',
      location:{lat: 48.87374758, lng: 2.29484351}
    },
    {
      nameOfScene: '夏乐宫',
      des: '观看埃菲尔铁塔的最佳地点！',
      location:{lat: 48.8619569, lng: 2.2887075}
    },
    {
      nameOfScene: '埃菲尔铁塔',
      des: '记得网上订票哦！',
      location:{lat: 48.8583701, lng: 2.2944813}
    }],
    [{
      nameOfScene: '巴士底广场',
      des: '巴黎的中山广场，只是离雨果故居比较近而已！',
      location:{lat: 48.85325491, lng: 2.36941392}
    },
    {
      nameOfScene: '蓬皮杜现代当代艺术中心',
      des: '一个充满奇怪建筑的地方！',
      location:{lat: 48.8606455, lng: 2.3500563}
    },
    {
      nameOfScene: '新桥',
      des: '塞纳河上最古老的桥！',
      location:{lat: 48.8570535, lng: 2.3391365}
    },
    {
      nameOfScene: '艺术桥',
      des: '爱情锁啊爱情锁！！',
      location:{lat: 48.8583459, lng: 2.3353197}
    },
    {
      nameOfScene: '圣日耳曼德佩教堂',
      des: '新庭信步拉丁区！',
      location:{lat: 48.8539638, lng: 2.3321619}
    },
    {
      nameOfScene: '蒙马特高地',
      des: '最市井的巴黎就在此处！别忘了爱墙和圣心堂哦！！',
      location:{lat: 48.8861947, lng: 2.3419952}
    },
    {
      nameOfScene: '爱墙',
      des: '各种各样的“我爱你”',
      location:{lat: 48.8846336, lng: 2.3386048}
    }
    ],
    [{
      nameOfScene: '凡尔赛宫',
      des: '气势恢宏，富丽堂皇，不得不去！',
      location:{lat: 48.8048684, lng: 2.1181667}
    }]
    ],
    dinner: [
    {
      nameOfScene: '小馋猫',
      des: '招牌菜：红酒烩鸡,红酒烩猪头',
      location:{lat: 41.773828, lng: 123.426843}
    },
    {
      nameOfScene: '大馋猫',
      des: '招牌菜：红酒烩猪头,红酒烩猪头',
      location:{lat: 41.824486, lng: 123.490939}
    }
    ],
    hotel:[
    {
      nameOfScene: 'clarrse',
      des: 'checkin:10AM;checkout:2PM',
      location:{lat: 41.77329, lng: 123.393641}
    },
    {
      nameOfScene: '旅店',
      des: 'checkin:10AM;checkout:255555PM',
      location:{lat: 41.82368, lng: 123.41247}
    }
    ]
}
var playData = function(arr){
      let newarray = []
      for (var i = 0; i < arr.length; i++){
        for(var j = 0; j < arr[i].length; j++){
          newarray.push(arr[i][j])
        }
      }
      return newarray
    }
var node = function(arr){
  var string = ''
  for (var i = 0; i < arr.length; i++){
    string+='<a href="#" class="list-group-item">'+arr[i].nameOfScene+'</a>'
  }
  return string
}
window.onload = function() {
  $('.wel_top1_left').on('click', () => {history.go(0)})
  if(window.localStorage.getItem("userData")){
    userData = window.localStorage.getItem("userData")
    $.get('/api/admin/get', {name: userData}, (data) => initial(data.data))
  } else {
    $('#myModal').modal({keyboard: false,backdrop: 'static',show: true})
    $('.submit').on('click', (e) => submit(e))
  }
}
function submit(e){
  e.preventDefault();
  var value = $('#message-text').val().trim()
  if(!value){
    return swal("请输入行程编号！")
  }
  $.get('/api/admin/get', {name: value}, (data) => check(data.data, value))
}
function check(data, name) {
  if(data && data.length > 0){
    window.localStorage.setItem('userData', name)
    $('#myModal').modal('hide')
    initial(data)
  } else{
    swal("您当前没有定制的旅行数据！")
  }
}
function initial(arr){
  arr.map((item, index) => {
    var play2 = []
    item.route.map((item, index) => {
      var obj = JSON.parse(item.location)
      obj.lat = parseFloat(obj.lat)
      obj.lng = parseFloat(obj.lng)
      item.location = obj
      //点数据分类
      if(item.pointOrNot === '1' && item.category === '0'){
        play2.push(item)
      } else if(item.pointOrNot === '1' && item.category === '1'){
        dinner.push(item)
      } else if(item.pointOrNot === '1' && item.category === '2'){
        hotel.push(item)
      } else{
        line.push(item)
      }
    })
    play.push(play2)
  })
//初始化侧边栏
  for (var i = 0; i < play.length; i++){
    $('.panel-group').append('<div class="panel panel-default">'+
      '<div class=panel-heading role=tab id=heading'+(i+1)+'>'+
        '<h4 class="panel-title">'+
          '<a role=button data-toggle=collapse data-parent=#accordion href=#collapse'+ (i+1) +' aria-expanded=false class=collapsed aria-controls=collapse'+(i+1)+'>'+
            'day'+ (i+1) +
          '</a>'+
        '</h4>'+
      '</div>'+
      '<div id=collapse'+ (i+1) +' class="panel-collapse collapse" role=tabpanel aria-labelledby=heading'+(i+1)+'>'+
        '<div class="panel-body">'+
          '<div class="list-group">'+
            node(play[i])+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>')
  }
//初始化地图
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 48.828973, lng: 2.2982042},
      zoom: 13,
      streetViewControl: false,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]
    })
    directionsDisplay.setMap(map)

  var centerControlDiv = document.createElement('div')
    centerControlDiv.style.width = '50px'
    centerControlDiv.style.height = '50px'
    centerControlDiv.style.borderRadius = '25px'
    centerControlDiv.style.marginLeft = '8px'
    centerControlDiv.style.marginBottom = '2px'
    centerControlDiv.index = 1
    centerControlDiv.className = "btn btn-danger"
    var LCT = document.createElement('span')
    LCT.style.left = '-20px'
    LCT.style.top = '-12px'
    LCT.className = 'glyphicon glyphicon-record'
    LCT.style.color = '#fff'
    LCT.style.fontSize = '35px'
    centerControlDiv.append(LCT)
    LCT.addEventListener('click', function() {
      if(!continuousPositioning){
        swal({
          title: "开启持续定位?",
          text: "这样会比较费点哦!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "开启持续定位!",
          cancelButtonText: "单次定位!",
          closeOnConfirm: false,
          closeOnCancel: false
        },
        function(isConfirm){
          if (isConfirm) {
            timer = setInterval(() => {navigator.geolocation.getCurrentPosition(complete, error)}, 10000)
            continuousPositioning = true
            swal("已开启持续定位!", "您可以再次点击关闭.", "success")
          } else {
            navigator.geolocation.getCurrentPosition(complete, error)
            swal("本次定位已完成!")
          }
        })
      } else{
        window.clearInterval(timer)
        continuousPositioning = false
        swal("持续定位已关闭!", "您可以再次点击开启!", "success")
      }
    })
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv)
    function createInfoWindow(title) {
      var info = document.createElement("div")
      info.id = "content"

      var top = document.createElement("h3")
      top.id = "firstHeading"
      top.className = "firstHeading"
      top.innerHTML = title.nameOfScene

      var titleD = document.createElement("div")
      var topC = document.createElement("p")
      topC.innerHTML = title.des
      titleD.appendChild(topC)

      var middle = document.createElement("div")
      
      var pWalk = document.createElement("p")
      pWalk.className = "btnLeft"
      var pA = document.createElement("a")
      pA.className = "btn btn-primary"
      pA.id = "walk"
      pA.href = "#"
      pA.role = "button"
      pA.innerHTML = "步行"
      pWalk.appendChild(pA)

      var pBus = document.createElement("p")
      pBus.className = "btnRight"
      var pB = document.createElement("a")
      pB.className = "btn btn-success"
      pB.id = "bus"
      pB.href = "#"
      pB.role = "button"
      pB.innerHTML = "公交"
      pBus.appendChild(pB)

      middle.appendChild(pWalk)
      middle.appendChild(pBus)
      //步行路线
      pA.onclick = function(){
        directionsService.route({
          origin: {lat: 48.828973, lng: 2.2982042},
          destination: title.location,
          travelMode: 'WALKING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response)
            topC.innerHTML = '需步行'+response.routes[0].legs[0].distance.text +'/大约用时'+ response.routes[0].legs[0].duration.text
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        })
      }
      //公交路线
      pB.onclick = function(){
        directionsService.route({
          origin: {lat: 48.828973, lng: 2.2982042},
          destination: title.location,
          travelMode: 'TRANSIT'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response)
            topC.innerHTML = '距离'+response.routes[0].legs[0].distance.text +'/大约用时'+ response.routes[0].legs[0].duration.text
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        })
      }
      info.appendChild(top)
      info.appendChild(titleD)
      info.appendChild(middle)
      return info
    }
  //初始化点
  playData(play).map(function(item, index){
    var infowindow = new google.maps.InfoWindow({
      content: createInfoWindow(item),
      maxWidth: 300
    })
    var marker = new google.maps.Marker({
      position: item.location,
      title: item.nameOfScene,
      label: (index+1).toString(),
      animation: google.maps.Animation.DROP
    })
    point[item.nameOfScene] = [infowindow,marker]
    marker.setMap(map)
    marker.addListener('click', function(){
      for( v in point){
        point[v][0].close()
      }
      infowindow.open(map, marker)
    })
  })
  dinner.map((item, index) => {
    var infowindow = new google.maps.InfoWindow({
      content: createInfoWindow(item),
      maxWidth: 300
    })
    var marker = new google.maps.Marker({
      position: item.location,
      title: item.name,
      animation: google.maps.Animation.DROP,
      icon: 'https://res.cloudinary.com/dnfhsjz8u/image/upload/c_scale,w_30/v1500446507/bergrb_qa6kz6.png',
      map: map
    })
    point[item.nameOfScene] = [infowindow,marker]
    marker.addListener('click', function(){
      for( v in point){
        point[v][0].close()
      }
      infowindow.open(map, marker)
    })
  })
  hotel.map((item, index) => {
    var infowindow = new google.maps.InfoWindow({
      content: createInfoWindow(item),
      maxWidth: 300
    })
    var marker = new google.maps.Marker({
      position: item.location,
      title: item.nameOfScene,
      animation: google.maps.Animation.DROP,
      icon: 'https://res.cloudinary.com/dnfhsjz8u/image/upload/c_scale,w_30/v1500447497/jd_l3iiyc.png',
      map: map
    })
    point[item.nameOfScene] = [infowindow,marker]
    marker.addListener('click', function(){
      for( v in point){
        point[v][0].close()
      }
      infowindow.open(map, marker)
    })
  })
  //定位
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(complete, error)
  }
  function complete(position) {
    pos = null
    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    console.log(pos)
    map.setCenter(pos)
    var myloc = new google.maps.Marker({
      clickable: false,
      icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                      new google.maps.Size(22,22),
                                                      new google.maps.Point(0,18),
                                                      new google.maps.Point(11,11)),
      shadow: null,
      position: pos,
      zIndex: 999,
      map: map
    })  
  }
  function error(){
    swal({
      title: "定位失败!",
      text: "请检查网络环境或点击刷新页面!",
      type: "warning",
      showCancelButton: false,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "点击刷新!",
      closeOnConfirm: false
    },
    function(){
      swal("Deleted!", "Your imaginary file has been deleted.", "success")
      history.go(0) 
    })
  }

  $('.list-group').delegate('a', 'click', function(e) {
    for( v in point){
      point[v][0].close()
    }
    var lable = e.target.innerHTML
      for ( key in point) {
        if ( lable == key) {
          thisMarker = point[key]
          break
        } else {
          continue
        }
      }
      thisMarker[0].open(map, thisMarker[1])
      var sidebar = $('.sidebar')
      sidebar.css('right',-250)
  })

  $('.panel-title').delegate('a', 'click', function(e) {
    console.log(e.target.innerHTML)
  })

}