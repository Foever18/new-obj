$(function (){
    const form = layui.form;
    const layer = layui.layer;
const initCate = function (){
    $.ajax({
        type: 'GET',
        url: "/my/article/cates",
        success: function (res) {
            if (res.status !== 0) return layer.msg('数据渲染失败');
            layer.msg('数据渲染成功')
            // 获取模板的信息并渲染
            var htmlStr = template("tpl-cate", res);
            $("[name=cate_id]").html(htmlStr);
            form.render('select')
        }
    })
}
initCate()
// 初始化富文本
initEditor()
//? 1. 初始化图片裁剪器
var $image = $('#image')

//? 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}

//? 3. 初始化裁剪区域
$image.cropper(options)

// 点击上传图片
// 点击上传按钮，模拟触发隐藏上传文件框
$('#btnChooseImage').on('click', function(e) {
    $('#coverFile').click()
})

//?4. 监听图片的变化，把图片添加到裁剪框
$('#coverFile').on('change', function (e) {
    // 获取到提交框
    let files = e.target.files
    if(files.length === 0) return;
    // 转化文件为字符串路径
    let imgUrl = URL.createObjectURL(files[0])
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgUrl) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
})
// 定义文章的状态
let art_state = '已发布' 
$('#btnSave2').on('click', function() {
    art_state = '草稿'
})
// 
$('#form-pub').on('submit', function(e) {
    console.log('点击了按钮');
    // 1. 阻止表单的默认提交行为
    e.preventDefault()
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0]);
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
        .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
    })
        .toBlob(function(blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
                window.parent.change()
            }
        })
    }
    
})
})