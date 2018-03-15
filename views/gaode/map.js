var walk = null
var transfer = null
let point = {}
let thisMarker = null
//let infoWindow = null
var isiPhone = navigator.userAgent.toLocaleLowerCase().match(/iPhone/i)

let userdata = {
  play: [[{
    name:'故宫',
    des:'沈阳必玩沈阳必玩沈阳必玩沈阳必玩沈阳必玩',
    location:[123.45573999999999, 41.797087]
  },
  {
    name:'颐和园',
    des:'沈阳必玩沈阳必玩沈阳必玩沈阳必玩沈阳必玩',
    location:[123.4043384233398,41.80236722739665]
  },
  {
    name:'颐',
    des:'沈阳必玩沈阳必玩沈阳必玩沈阳必玩沈阳必玩',
    location:[123.5043385233398,41.80236722739665]
  }]],
  dinner: []
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
    string+='<a href="#" class="list-group-item">'+arr[i].name+'</a>'
  }
  return string
}

document.onreadystatechange = function(){
  if(document.readyState === 'complete'){
    $('.loading').fadeOut()
  }
}

window.onload=function(){
  let area = window.localStorage.getItem("area")
  console.log(area)
  if(area === 'china'){
    console.log('in china')
  } else if(area === 'abroad'){
    console.log('in abroad')
    window.location.href = '/api/google'
  }else {
    swal({
          title: "您的区域?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "中国",
          cancelButtonText: "外国",
          closeOnConfirm: false,
          closeOnCancel: false
        },
        function(isConfirm){
          if (isConfirm) {
            window.localStorage.setItem('area', 'china')
            swal("干得漂亮！", "你在中国！","success")
          } else {
            window.localStorage.setItem('area', 'abroad')
            window.location.href = '/api/google'
          }
        })
  }

   
  for (var i = 0; i < userdata.play.length; i++){
    $('.panel-group').append('<div class="panel panel-default">'+
      '<div class="panel-heading" role="tab" id="headingOne">'+
        '<h4 class="panel-title">'+
          '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
            'day'+ (i+1) +
          '</a>'+
        '</h4>'+
      '</div>'+
      '<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">'+
        '<div class="panel-body">'+
          '<div class="list-group">'+
            node(userdata.play[i])+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>')
  }

  $('.list-group').delegate('a', 'click', function(e) { 
    var lable = e.target.innerHTML
    for ( key in point) {
      if ( lable == key) {
        thisMarker = point[key]
        break
      } else {
        continue
      }
    }
    thisMarker[0].open(map, thisMarker[1].getPosition())
    var sidebar = $('.sidebar')
    sidebar.css('right',-250)
  })

  var myPosition
  //地图初始化
  var map = new AMap.Map("container", {
      resizeEnable: true,
      mapStyle:'fresh',
      zoom: 12
  })
    
  //--地图插件
  AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
    map.addControl(new BasicControl.Zoom({
        position: 'rb', //left top，左上角
        showZoomNum: false //显示zoom值
    }))
  })
  //--加载服务
  AMap.service('AMap.Walking', function(){
    walk = new AMap.Walking({ map: map})
  })
  AMap.service('AMap.Transfer',function(){//回调函数
    transfer= new AMap.Transfer({ city: '沈阳', map: map})
  })
  //--定位
  map.plugin('AMap.Geolocation', function() {
    geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition:'LB'
    })
    map.addControl(geolocation)
    geolocation.getCurrentPosition()
    AMap.event.addListener(geolocation, 'complete', onComplete)//返回定位信息
    AMap.event.addListener(geolocation, 'error', onError)      //返回定位出错信息
  })
    //--定位成功
    function onComplete(data) {
      //--自己的位置
      var myPosition = [data.position.getLng(),data.position.getLat()]   
      //--points
      playData(userdata.play).map(function(item, index){   
    
        var infoWindow = new AMap.InfoWindow({
            isCustom: true,  //使用自定义窗体
            content: createInfoWindow(item),
            offset: new AMap.Pixel(16, -45)
        })
      //构建自定义信息窗体
      function createInfoWindow(title) {
        var info = document.createElement("div")
        info.className = "info";
        // 定义顶部标题
        var top = document.createElement("div")
        var titleD = document.createElement("div")
        var closeX = document.createElement("img")
        top.className = "info-top"
        titleD.innerHTML = title.name
        closeX.src = "http://webapi.amap.com/images/close2.gif";
        closeX.onclick = closeInfoWindow

        top.appendChild(titleD)
        top.appendChild(closeX)
        info.appendChild(top)

        // 定义中部内容
        var middle = document.createElement("div")
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white'
        middle.innerHTML = title.des;
        var left = document.createElement("div")
        left.onclick = function(){
          walk.clear()
          transfer.clear()
          transfer.search(myPosition, item.location, function(status, result){
            middle.innerHTML = item.des
          })
        }
        var right = document.createElement("div")
        right.onclick = function(){
          walk.clear()
          transfer.clear()
          walk.search(myPosition, item.location, function(status, result){
            middle.innerHTML = '需步行'+result.routes[0].distance + '米/用时' + Math.ceil(result.routes[0].time/60) +'分钟'
          })
        }
        left.innerHTML = '公交'
        right.innerHTML = '步行'
        left.className = 'infoleft'
        right.className = 'inforight'
        info.appendChild(middle)
        info.appendChild(left)
        info.appendChild(right)

        // 定义底部内容
        var bottom = document.createElement("div")
        bottom.className = "info-bottom"
        bottom.style.position = 'relative'
        bottom.style.top = '0px'
        bottom.style.margin = '0 auto'
        var sharp = document.createElement("img")
        sharp.src = "http://webapi.amap.com/images/sharp.png"
        bottom.appendChild(sharp)
        info.appendChild(bottom)
        return info
      }

      function closeInfoWindow() {map.clearInfoWindow()}

      AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
        var marker = new SimpleMarker({
              iconLabel: (index+1),
              iconStyle: 'blue',
              map: map,
              position: item.location
            })
        marker.setMap(map)
        point[item.name] = [infoWindow,marker]
        marker.setExtData({'id':item.name})
        marker.on('click', function(e){
          infoWindow.open(map, this.getPosition())
        })
      })
    })//map
  }
  //解析定位错误信息
  function onError(data) {}
}