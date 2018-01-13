$( function () {
    function move() {
        var ps = {
            L: [],
            R: [],
            T: [],
            B: []
        };
        for(var i = 7; i >= 0; i--) {
            var oLi = $('li').eq(i),
                gLi = oLi.get(0);
            oLi.css({
                'left': gLi.offsetLeft + 'px',
                'top': gLi.offsetTop + 'px',
                'position': 'absolute',
                'margin': 0
            });
            ps.L.push(gLi.offsetLeft);
            ps.T.push(gLi.offsetTop);
            ps.R.push(gLi.offsetLeft + gLi.offsetWidth);
            ps.B.push(gLi.offsetTop + gLi.offsetHeight);
        };
        ps.L = ps.L.reverse();
        ps.R = ps.R.reverse();
        ps.T = ps.T.reverse();
        ps.B = ps.B.reverse(); //储存位置
        //初始化
        $(document).on('mousedown', 'li', function (e) {
            e.preventDefault();
            var _this = this;
            if( _this.setCapture ) {
                _this.setCapture()
            };
            var X = e.clientX - _this.offsetLeft,
                Y = e.clientY - _this.offsetTop,
                oList = $('li'),
                attr = [];
            my_index = $(_this).attr('index'); //初始保存一个原来的Index,回到原来的数组(位置)
            $(_this).css({
                'opacity': 0.9,
                'zIndex': 1
            });
            document.index = my_index; //目的是为了脱离变量作用域
            $('li').each(function() {
                attr.push($(this).attr('index'))
            });
            $(document).on('mousemove', function (e) {
                var lt = e.clientX - X,
                    tp = e.clientY - Y,
                    screen_l = e.clientX - _this.parentNode.offsetLeft,
                    screen_t = e.clientY - _this.parentNode.offsetTop;
                $(_this).css({
                    'left': lt + 'px',
                    'top': tp + 'px'
                });
                for(var i = 0; i < 8; i++) {
                    var he_index = parseInt(oList.eq(i).attr('index'));
                    if(screen_l > ps.L[he_index] && screen_l < ps.R[he_index] && screen_t > ps.T[he_index] && screen_t < ps.B[he_index]) {
                        var i_index = parseInt($(_this).attr('index'));
                        if(he_index == i_index) continue;
                        document.index = he_index; //当找到元素保存要抵达的位置的index
                        document.flag = false;
                        var test = function(num, j) {
                            var he_Li = $('li[index=' + j + ']');
                            $(he_Li).stop();
                            he_Li.animate({
                                left: ps.L[j + num],
                                top: ps.T[j + num]
                            }, 'fast');
                            he_Li.attr('index', j + num);
                        };
                        //利用属性选择器找到对应index(也就是找到数组相应位置)的元素;并且变换属性index到相应的数组索引；
                        if(i_index > he_index) {
                            for(var j = i_index - 1; j >= he_index; j--) {
                                test(1, j);
                            };
                        } else {
                            for(var j = i_index + 1; j < he_index + 1; j++) {
                                test(-1, j);
                            };
                        };
                        $(_this).attr('index', he_index); //变换_this的index
                        document.flag = true;
                    } else {
                        if(document.flag) {
                            var parent = _this.parentNode,
                                parent_X = e.clientX - parent.offsetLeft,
                                parent_Y = e.clientY - parent.offsetTop;
                            if(parent_X < 0 || parent_X > parent.offsetWidth || parent_Y < 0 || parent_Y > parent.offsetHeight) {
                                oList.not(_this).each(function(index, element) {
                                    var a = $(element).index();
                                    $(element).animate({
                                        left: ps.L[attr[a]],
                                        top: ps.T[attr[a]]
                                    }, 'fast').attr('index', attr[a])
                                });
                                document.index = my_index;
                                $(_this).attr('index', my_index);
                                document.flag = false;//当移出父节点还原
                            };
                        };
                    };
                };
            });
            $(document).on('mouseup', function() {
                if(_this.releaseCapture) {
                    _this.releaseCapture();
                };
                $(this).off('mousemove');
                $(this).off('mouseup');
                $(_this).animate({
                    left: ps.L[document.index],
                    top: ps.T[document.index]
                }, 'fast', function() {
                    $(_this).css({
                        'opacity': 1,
                        'zIndex': 0
                    });
                });
                delete document.index;
                delete document.flag;
            });
        });
    };
    move();
});