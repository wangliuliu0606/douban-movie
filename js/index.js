var Helpes = {
  isToBottom: function($viewport,$content){
    return $viewport.height() + $viewport.scrollTop() +30 > $content.height()
  },

  createNode: function(subject){
    var directors = []
    var starring = []
    var $node = $(`<div class="item">
                      <a href="#">
                        <div class="cover">
                          <img src="http://img7.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg" alt="">
                        </div>
                        <div class="detail">
                          <h2>霸王别姬</h2>
                          <div class="texts"><span class="score">1994</span>分 / <span class="plot">犯罪、剧情</span></div>
                          <div class="texts">导演：<span class="director">犯罪、剧情</span></div>
                          <div class="texts">主演：<span class="starring">犯罪、剧情</span></div>
                        </div>
                      </a>
                    </div>`)
    $node.find('a').attr('href',subject.alt)
    $node.find('.cover img').attr('src',subject.images.small)
    $node.find('.detail h2').text(subject.title)
    $node.find('.detail .score').text(subject.rating.average)
    $node.find('.detail .plot').text(subject.genres.join('、'))
    subject.directors.forEach(function(e){
      directors.push(e.name)
    })
    $node.find('.detail .director').text(directors.join('、'))
    subject.casts.forEach(function(e){
      starring.push(e.name)
    })
    $node.find('.detail .starring').text(starring.join('、'))
    return $node
  }
}


var Event = {
  init: function(){
    this.$btns = $('footer > div')
    this.$tabs = $('main > section')
    this.bind()
  },

  bind: function(){
    var _this = this
    this.$btns.click(function(){
      var index = $(this).index()
      $(this).addClass('active')
             .siblings().removeClass('active')
      _this.$tabs.hide()
                 .eq(index).fadeIn()
    })
  }
}

var Top250 = {
  init: function(){
    var _this = this
    this.$container = $('#top250')
    this.$content = this.$container.find('.container')
    this.isLoading = false
    this.isFinshed = false
    this.page = 0
    this.count = 10
    this.bind()
    this.getData(function(data){
      _this.setData(data)
      _this.page++
    })

  },

  bind: function(){
    var _this = this
    this.$container.on('scroll',function(){
      if((Helpes.isToBottom(_this.$container,_this.$content) && !_this.isLoading && !_this.isFinshed)){
        _this.getData(function(data){
          _this.setData(data)
          _this.page++
          if(this.page * this.count > data.total){
            _this.isFinshed = true
          }
        })
      }
    })
  },

  getData: function(callback){
    var _this = this
    this.isLoading = true
    this.$container.find('.loading').show(400)
    $.ajax({
      url: 'https://api.douban.com/v2/movie/top250',
      type: 'GET',
      data: {
        start: this.page * this.count,
        count: this.count
      },
      dataType: 'jsonp',
    }).done(function(ret){
      _this.isLoading = false
      _this.$container.find('.loading').hide(400)
      callback(ret)
    }).fail(function(){
      console.log('数据获取失败...')
    })
  },

  setData: function(data){
    var _this = this
    console.log(data)
    data.subjects.forEach(function(moive){
      var $node = Helpes.createNode(moive)
      _this.$content.append($node)
    })
  }
}

var UsBox = {
  init: function(){
    var _this = this
    this.$container = $('#us')
    this.$content = this.$container.find('.container')
    this.getData(function(data){
      _this.setData(data)
    })

  },

  getData: function(callback){
    var _this = this
    this.$container.find('.loading').show(400)
    $.ajax({
      url: 'https://api.douban.com/v2/movie/us_box',
      type: 'GET',
      dataType: 'jsonp'
    }).done(function(ret){
      _this.$container.find('.loading').hide(400)
      callback(ret)
    }).fail(function(){
      console.log('数据获取失败...')
    })
  },

  setData: function(data){
    var _this = this
    console.log(data)
    data.subjects.forEach(function(moive){
      var $node = Helpes.createNode(moive.subject)
      _this.$content.append($node)
    })
  }
}

var Search = {
  init: function(){
    this.$container = $('#search')
    this.$content = this.$container.find('.container')
    this.isLoading = false
    this.isFinshed = false
    this.page = 0
    this.count = 10
    this.bind()
  },

  bind: function(){
    var _this = this
    this.$container.find('.loading').hide()
    this.$container.find('.button').click(function(){
      _this.$content.text('')
      _this.getData(function(data){
        _this.setData(data)
        _this.page++
      })
    })

    this.$container.find('input').on('keyup',function(e){
      if(e.key === 'Enter'){
        _this.$content.text('')
        _this.getData(function(data){
          _this.setData(data)
          _this.page++
        })
      }
    })

    this.$container.find('.search-result').on('scroll',function(){
      if(Helpes.isToBottom(_this.$container.find('.search-result'),_this.$content) && !_this.isLoading && !_this.isFinshed){
        _this.getData(function(data){
          _this.setData(data)
          _this.page++
          if(_this.page * _this.count > data.total){
            _this.isFinshed = true
          }
        })
      }
    })
  },

  getData: function(callback){
    var _this = this
    var keyword = _this.$container.find('input').val()
    this.isLoading = true
    this.$container.find('.loading').show(400)
    $.ajax({
      url: 'https://api.douban.com/v2/movie/search',
      type: 'GET',
      data: {
        q: keyword,
        start: this.page * this.count,
        count: this.count
      },
      dataType: 'jsonp',
    }).done(function(ret){
      _this.isLoading = false
      _this.$container.find('.loading').hide(400)
      callback(ret)
    }).fail(function(){
      console.log('数据获取失败...')
    })
  },

  setData: function(data){
    var _this = this
    console.log(data)
    data.subjects.forEach(function(moive){
      var $node = Helpes.createNode(moive)
      _this.$content.append($node)
    })
  }
}



var App = {
  init: function(){
    Event.init()
    Top250.init()
    UsBox.init()
    Search.init()
  }
}

App.init()