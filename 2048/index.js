(function () {

    let wrap = document.querySelector('.wrap');//获取包裹的wrap
    let map = [];//存储记录2048的数值及位置
    let direction = null; //移动的方向
    let scroe = 0;//记录分值
    let judge = false;
    //初始化map
    function mapInit(map) {
        for (var i = 0; i < 4; i++) {
            map[i] = [];
            for (var j = 0; j < 4; j++) {
                map[i][j] = 0;
            }
        }
        return map;
    }

    map = mapInit(map); //存储生成块的位置(初始化)
    //在地图内随机生成一个块
    function randomBlock(wrap) {
        let span = wrap.querySelectorAll('span');
        if (span.length == 16) {
            alert('游戏结束');
            judge = true;
            return false;
        }

        do {//随机生成x，y,如果生成的位置已有重新生成
            var x = parseInt(Math.random() * 4);
            var y = parseInt(Math.random() * 4);
        } while (map[x][y]);
        map[x][y] = 2;//在当前生成的块位置设置初始值为2
        //新增一个span
        var box = document.createElement('span');
        //给span添加自定义属性x，y,及对应的num值
        box.setAttribute('x', x);
        box.setAttribute('y', y);
        box.setAttribute('num', 2);
        //生成块的位置
        x = (x * 100) + 14 + (12 * x);
        y = (y * 100) + 14 + (12 * y);
        box.style.left = y + 'px';
        box.style.top = x + 'px';
        //设置innertext
        box.innerText = 2;
        //添加进wrap里
        wrap.appendChild(box);
    }
    //开局生成两个
    randomBlock(wrap);
    randomBlock(wrap);
    //触屏控制移动方向
    document.ontouchstart = function (e) {
        var e = e || window.event;
        //获取开始触碰的坐标
        let xStart = e.touches[0].clientX;
        let yStart = e.touches[0].clientY;
        //获取开始触碰结束的坐标
        document.ontouchend = function (e) {
            var e = e || window.event;
            //获取触碰结束的坐标
            let xEnd = e.changedTouches[0].clientX;
            let yEnd = e.changedTouches[0].clientY;
            //坐标差
            let xDif = xEnd - xStart;
            let yDif = yEnd - yStart;
            //根据坐标差移动
            if (xDif >= 100) { direction = 'right'; toMove('right'); }
            else if (xDif <= -100) { direction = 'left'; toMove('left') }
            else if (yDif >= 100) { direction = 'bottom'; toMove('bottom') }
            else if (yDif <= -100) { direction = 'top'; toMove('top') }
        }

    }
    //键盘控制移动
    document.onkeydown = function (e) {
        var e = e || window.event;
        //如果e.keyCode范围在37~40之间
        if (e.keyCode > 36 && e.keyCode < 41) {
            switch (e.keyCode) {
                case 37: direction = 'left'; break;
                case 38: direction = 'top'; break;
                case 39: direction = 'right'; break;
                case 40: direction = 'bottom'; break;
            }
            toMove(direction);
        }
    }
    //执行移动
    function  toMove(direction) {
        if(judge){
            alert('游戏结束');
            return false;
        }
        moveBox(direction);
        merge(direction);
    }
    //根据方向全部往一个方向移动
    function moveBox(direction) {
        let span = wrap.querySelectorAll('span');
        //遍历每个span块
        for (let i = 0; i < span.length; i++) {
            //获取每个span的x,y
            let x = Number(span[i].getAttribute('x'));
            let y = Number(span[i].getAttribute('y'));
            switch (direction) {
                case 'left':
                    //如果当前块位于最左边则
                    if (y == 0) {
                        continue;
                    } else {
                        //获取当前块左边有多少个块
                        let xBox = 0;
                        for (var j = 0; j < y; j++) {
                            if (map[x][j] != 0) {
                                xBox++;
                            }
                        }
                        //设置自定义属性y
                        span[i].setAttribute('y', xBox);
                        //移动
                        span[i].style.left = 14 + xBox * (100 + 12) + 'px';
                    }
                    break;
                case 'right':
                    //如果当前块位于最右边则
                    if (y == 3) {
                        continue;
                    } else {
                        //获取当前块右边有多少个块
                        let xBox = 0;
                        for (var j = 3; j > y; j--) {
                            if (map[x][j] != 0) {
                                xBox++;
                            }
                        }
                        //改变自定义属性y
                        span[i].setAttribute('y', 3 - xBox);
                        //移动
                        span[i].style.left = 14 + (3 - xBox) * (100 + 12) + 'px';
                    }
                    break;
                case 'top':
                    //如果当前块位于最上边则
                    if (x == 0) {
                        continue;
                    } else {
                        //获取当前块上边有多少个块
                        let yBox = 0;
                        for (var j = 0; j < x; j++) {
                            if (map[j][y] != 0) {
                                yBox++;
                            }
                        }
                        //改变自定义属性x
                        span[i].setAttribute('x', yBox);
                        //移动
                        span[i].style.top = 14 + yBox * (100 + 12) + 'px';
                    }
                    break;
                case 'bottom':
                    //如果当前块位于最下边则
                    if (x == 3) {
                        continue;
                    } else {
                        //获取当前块上边有多少个块
                        let yBox = 0;
                        for (var j = 3; j > x; j--) {
                            if (map[j][y] != 0) {
                                yBox++;
                            }
                        }
                        //改变自定义属性x
                        span[i].setAttribute('x', 3 - yBox);
                        //移动
                        span[i].style.top = 14 + (3 - yBox) * (100 + 12) + 'px';
                    }
                    break;
            }
        }
        //根据改变位置后的块修改map矩阵
        map = resetMap();
    }
    //根据标签对应的位置重构map
    function resetMap() {
        let span = wrap.querySelectorAll('span');
        map = mapInit(map);
        for (var i = 0; i < span.length; i++) {
            let x = Number(span[i].getAttribute('x'));
            let y = Number(span[i].getAttribute('y'));
            map[x][y] = Number(span[i].getAttribute('num'));
        }
        return map;
    }
    //合并
    function merge(direction) {
        let span = wrap.querySelectorAll('span');
        for (let i = 0; i < map.length; i++) {
            //如果是左边
            if (direction == 'left') {
                for (let j = 0; j < map[i].length - 1; j++) {
                    if (map[i][j] != 0 && map[i][j] == map[i][j + 1]) {

                        for (let k = 0; k < span.length; k++) {
                            //移除这个块
                            if (Number(span[k].getAttribute('x')) == i && Number(span[k].getAttribute('y')) == (j + 1)) {
                                span[k].style.transform = 'translateX(-110px)';
                                wrap.removeChild(span[k]);
                            }
                            //改变这个块的数字及标签上对应的坐标
                            if (Number(span[k].getAttribute('x')) == i && Number(span[k].getAttribute('y')) == j) {
                                //计算块相加得到的数字
                                let numAdd = Number(map[i][j + 1]) + Number(map[i][j]);
                                //改变自定义属性num的值
                                // span[k].setAttribute('num', numAdd)
                                // span[k].innerText = numAdd;
                                // //改变颜色
                                // changeColor(span[k]);
                                // //计算总分
                                // scroe += numAdd;
                                mergeCode(span[k],numAdd);
                            }
                        }
                        j++;
                    }
                }
            }
            //如果是右边
            if (direction == 'right') {
                for (let j = 3; j >= 1; j--) {
                    if (map[i][j] != 0 && map[i][j] == map[i][j - 1]) {

                        for (let k = 0; k < span.length; k++) {
                            //移除这个块
                            if (Number(span[k].getAttribute('x')) == i && Number(span[k].getAttribute('y')) == (j - 1)) {
                                span[k].style.transform = 'translateX(110px)';
                                wrap.removeChild(span[k]);
                            }
                            //改变这个块的数字及标签上对应的坐标
                            if (Number(span[k].getAttribute('x')) == i && Number(span[k].getAttribute('y')) == j) {
                                let numAdd = Number(map[i][j - 1]) + Number(map[i][j]);
                                
                                mergeCode(span[k],numAdd);
                            }
                        }
                        j--;
                    }
                }
            }
            //如果是上边
            if (direction == 'top') {
                for (let j = 0; j < map.length - 1; j++) {

                    if (map[j][i] != 0 && map[j][i] == map[j + 1][i]) {

                        for (let k = 0; k < span.length; k++) {
                            //移除这个块
                            if (Number(span[k].getAttribute('x')) == j + 1 && Number(span[k].getAttribute('y')) == i) {
                                span[k].style.transform = 'translateY(-110px)';
                                wrap.removeChild(span[k]);
                            }
                            //改变这个块的数字及标签上对应的坐标
                            if (Number(span[k].getAttribute('x')) == j && Number(span[k].getAttribute('y')) == i) {
                                let numAdd = Number(map[j + 1][i]) + Number(map[j][i]);
                            
                                mergeCode(span[k],numAdd);
                            }
                        }
                        j++;
                    }
                }
            }
            //如果是下边
            if (direction == 'bottom') {
                for (let j = 3; j >= 1; j--) {

                    if (map[j][i] != 0 && map[j - 1][i] == map[j][i]) {

                        for (let k = 0; k < span.length; k++) {
                            //移除这个块
                            if (Number(span[k].getAttribute('x')) == j - 1 && Number(span[k].getAttribute('y')) == i) {
                                span[k].style.transform = 'translateY(110px)';
                                wrap.removeChild(span[k]);
                            }
                            //改变这个块的数字及标签上对应的坐标
                            if (Number(span[k].getAttribute('x')) == j && Number(span[k].getAttribute('y')) == i) {
                                let numAdd = Number(map[j - 1][i]) + Number(map[j][i]);
                    
                                mergeCode(span[k],numAdd);
                            }
                        }
                        j--;
                    }
                }
            }
        }
        map = resetMap();
        moveBox(direction);
        document.querySelector('.score em').innerText = scroe;
        randomBlock(wrap);

    }
    //合并复用代码
    function mergeCode(dom,numAdd) {
        dom.setAttribute('num', numAdd)
        dom.innerText = numAdd;
        changeColor(dom);
        scroe += numAdd;
    }
    //改变颜色
    function changeColor(dom) {
        let num = dom.getAttribute('num');
        switch (num) {
            case '2': dom.style.backgroundColor = '#eee4da'; break;
            case '4': dom.style.backgroundColor = '#ede0c8'; break;
            case '8': dom.style.backgroundColor = '#f2b179'; break;
            case '16': dom.style.backgroundColor = '#f59563'; break;
            case '32': dom.style.backgroundColor = '#f67c5f'; break;
            case '64': dom.style.backgroundColor = '#f65e3b'; break;
            case '128': dom.style.backgroundColor = '#edcf72'; break;
            case '256': dom.style.backgroundColor = '#edcc61'; break;
            case '512': dom.style.backgroundColor = '#edc850'; break;
            case '1024': dom.style.backgroundColor = '#edc53f'; break;
            case '2048': dom.style.backgroundColor = '#edc22e'; break;

        }
    }
})()