let map
let myloc = null
let pos
let userData
let isiPhone = navigator.userAgent.toLocaleLowerCase().match(/iPhone/i)
let thisMarker
let point = {}
let line = []
let play = []
let dinner = []
let hotel = []
let timer
let continuousPositioning = false
let playData = function(arr){
      let newarray = []
      for (let i = 0; i < arr.length; i++){
        for(let j = 0; j < arr[i].length; j++){
          newarray.push(arr[i][j])
        }
      }
      return newarray
    }
let node = function(arr){
  let string = ''
  for (let i = 0; i < arr.length; i++){
    string+='<a href="#" class="list-group-item">'+arr[i].nameOfScene+'</a>'
  }
  return string
}

document.onreadystatechange = function(){
  if(document.readyState === 'complete'){
    $('.loading').fadeOut()
  }
}
//加载完成
window.onload = function() {
  $('.wel_top1_left').on('click', () => {history.go(0)})
  if(window.localStorage.getItem("userData")){
    userData = window.localStorage.getItem("userData")
    $.get('/api/admin/get', {name: userData}, (data) => {
      if(data.data.length > 0){initial(data.data)}
      else {swal("您暂无定制数据！")}
    })
  } else {
    $('#myModal').modal({keyboard: false,backdrop: 'static',show: true})
    $('.submit').on('click', (e) => submit(e))
  }
}
function submit(e){
  e.preventDefault();
  let value = $('#message-text').val().trim()
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
    let play2 = []
    item.route.map((item, index) => {
      let obj = JSON.parse(item.location)
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
  for (let i = 0; i < play.length; i++){
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
  let directionsService = new google.maps.DirectionsService;
  let directionsDisplay = new google.maps.DirectionsRenderer
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 48.85885895, lng: 2.3470599},
      zoom: 15,
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

  let centerControlDiv = document.createElement('div')
    centerControlDiv.style.width = '50px'
    centerControlDiv.style.height = '50px'
    centerControlDiv.style.borderRadius = '25px'
    centerControlDiv.style.marginLeft = '8px'
    centerControlDiv.style.marginBottom = '2px'
    centerControlDiv.index = 1
    centerControlDiv.className = "btn btn-danger"
    let LCT = document.createElement('span')
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
      let info = document.createElement("div")
      info.id = "content"

      let top = document.createElement("h3")
      top.id = "firstHeading"
      top.className = "firstHeading"
      top.innerHTML = title.nameOfScene

      let titleD = document.createElement("div")
      let topC = document.createElement("p")
      let topD = document.createElement("p")
      topC.innerHTML = title.des
      titleD.appendChild(topC)
      titleD.appendChild(topD)

      let middle = document.createElement("div")
      
      let pWalk = document.createElement("p")
      pWalk.className = "btnLeft"
      let pA = document.createElement("a")
      pA.className = "btn btn-primary"
      pA.id = "walk"
      pA.href = "#"
      pA.role = "button"
      pA.innerHTML = "步行"
      pWalk.appendChild(pA)

      let pBus = document.createElement("p")
      pBus.className = "btnRight"
      let pB = document.createElement("a")
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
        if(pos){
        directionsService.route({
          origin: pos,
          destination: title.location,
          travelMode: 'WALKING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response)
            topD.innerHTML = '需步行'+response.routes[0].legs[0].distance.text +'/大约用时'+ response.routes[0].legs[0].duration.text
          } else {
            swal("当前无路线信息!")
          }
        })
        } else{
          swal("本次定位已完成!")
        }
      }
      //公交路线
      pB.onclick = function(){
        if(pos){
            directionsService.route({
            origin: pos,
            destination: title.location,
            travelMode: 'TRANSIT'
          }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response)
              topD.innerHTML = '距离'+response.routes[0].legs[0].distance.text +'/大约用时'+ response.routes[0].legs[0].duration.text
            } else {
              swal("当前无路线信息!")
            }
          })
        } else {
          swal("正在定位中，请稍后!")
        }
      }
      info.appendChild(top)
      info.appendChild(titleD)
      info.appendChild(middle)
      return info
    }
  //初始化点
  playData(play).map(function(item, index){
    let infowindow = new google.maps.InfoWindow({
      content: createInfoWindow(item),
      maxWidth: 300
    })
    let marker = new google.maps.Marker({
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
    let infowindow = new google.maps.InfoWindow({
      content: createInfoWindow(item),
      maxWidth: 300
    })
    let marker = new google.maps.Marker({
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
    let infowindow = new google.maps.InfoWindow({
      content: createInfoWindow(item),
      maxWidth: 300
    })
    let marker = new google.maps.Marker({
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
  } else {
    alert('不支持定位！')
  }
  function complete(position) {
    pos = null
    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    map.setCenter(pos)
    if(myloc){
      myloc.setMap(null)
      myloc = null
    }
    myloc = new google.maps.Marker({
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
      history.go(0) 
    })
  }

  $('.list-group').delegate('a', 'click', function(e) {
    for( v in point){
      point[v][0].close()
    }
    let lable = e.target.innerHTML
      for ( key in point) {
        if ( lable == key) {
          thisMarker = point[key]
          break
        } else {
          continue
        }
      }
      thisMarker[0].open(map, thisMarker[1])
      let sidebar = $('.sidebar')
      sidebar.css('right',-250)
  })

  $('.panel-title').delegate('a', 'click', function(e) {
    //console.log(e.target.innerHTML)
  })
}