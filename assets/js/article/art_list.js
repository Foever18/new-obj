$(function () {
  const laypage = layui.laypage;
  const form = layui.form;
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };

  // ?初始化文章分类
  const initTable = function () {
    $.ajax({
      type: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！");
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total);
      },
    });
  };
  initTable();

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  // ?初始化文章分类的方法
  const initCate = () => {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！");
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  };
  initCate();

  // 筛选功能
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    const cate_id = $("[name=cate_id]").val();
    const state = $("[name=state]").val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  // ?调用 laypage.render() 方法来渲染分页的结构
  function renderPage(total) {
    laypage.render({
      elem: "pageBox", // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit
        if (!first) {
          initTable();
        }
      },
    });
  }

  // ?删除功能
  $('tbody').on('click','.btn-delete',function(e) {
    console.log(1);
    var id = $(this).attr('id');
    let len =  $('.btn-delete').length;
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (){
      // 判断当前页面是否还有数据
      
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('删除文章失败！')
            }
            layer.msg('删除文章成功！')
            if(len===1){
              q.pagenum = q.pagenum === 1?1:q.pagenum-1
            }
            initTable()
        }
    })
    })
  })
});
