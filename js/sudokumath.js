const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const boardWidth = canvas.width;
const boardHeight = canvas.height;

var size = 4;
var sizeBox = 2;  //宫size
var datas = [];
var hard= 8;   //困难模式
//////////////////////
//程序入口
////////////////////
function Start() {
    
    
}

function CreateSudokuA4(category){
    var toastDlg = new Toast({
        text:"生成中"
    });
    toastDlg.Show();
    //ctx.clearRect(0,0,boardWidth,boardHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,boardWidth,boardHeight);
    
    if(category == 1){
        hard= 8;
        //A4 四宫
        CreateSudoKu4();
    }else if(category == 2){
        hard= 18;
        //A4 九宫
        CreateSudoKu9();
    }else if(category == 3){
        hard= 36;
        CreateSudoKu9();
    }else if(category == 4){
        hard= 54;
        CreateSudoKu9();
    }else if(category == 5){
        hard= 72;
        CreateSudoKu9();
    }else if(category == 6){
        hard= 46;
        CreateSudoKu9();
    }

    //二维码
    DrawImage('./qr.png',()=>{
        toastDlg.Close();
        ShowImageDlg();
    });
}

function CreateSudoKu9() {
    //1.title
    WriteText("九宫数独", 8.0, 2.0, 1.0);
    size = 9;
    sizeBox = 3;
    //hard = 18;
    let stepx = 10;
    let stepy = 12;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            //1.创建
            CreateSudoKuDatas();
            //2.添加空格
            CreateFilter();
            //2.绘制
            DrawBox(1 + stepx * j, 5 + stepy * i, 1, 1, 0.5);
            //console.log(datas);
        }
    }
}

function CreateSudoKu4() {
    //1.title
    WriteText("四宫数独", 8.0, 2.0, 1.0);
    size = 4;
    sizeBox = 2;
    //hard = 8;
    let stepx = 9;
    let stepy = 8;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            //1.创建
            CreateSudoKuDatas();
            //2.添加空格
            CreateFilter();
            //2.绘制
            DrawBox(3 + stepx * j, 5 + stepy * i, 1.5, 1.5);
            //console.log(datas);
        }
    }
}

function InitDatas() {
    //1.创建矩阵
    for (let i = 0; i < size; i++) {
        datas[i] = [];
        for (let j = 0; j < size; j++) {
            //datas[i].push(j+1);
            datas[i].push(0);
        }
    }
}

function CreateSudoKuDatas() {
    //1.初始化Datas
    InitDatas();
    //2.初始化数独矩阵
    let startVal = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let v = startVal; v <= size * size; v++) {
                let val = v % size + 1;
                if (ValidRow(i, j, val) && ValidColumn(i, j, val) && ValidBox(i, j, val)) {
                    datas[i][j] = val;
                    startVal = val;
                    break;
                }
            }
        }
    }

    //3.随机交换行和列
    for (let i = 0; i < 100; i++) {
        let md = RandomInt(0, 1);
        if (md == 0) {
            let r = GetRandPosition();
            let r2 = GetRandPosition(r);
            SwitchRows(r, r2);
        } else {
            let c = GetRandPosition();
            let c2 = GetRandPosition(c);
            SwitchColumns(c, c2);
        }
    }
}

//根据难度系数创建遮挡
function CreateFilter(){
    let inum = 0;
    while(1){
        let r = RandomInt(0, size - 1);
        let c = RandomInt(0, size - 1);
        if(datas[r][c] != 0){
            datas[r][c] = 0;
            ++inum;
        }

        if(inum == hard){
            break;
        }
    }
}

//输出--绘制
function DrawBox(x0, y0, stepx, stepy,fontHei) {
    fontHei = fontHei || 1.0;
    //1.时间
    WriteText("用时______", x0, y0-fontHei-0.5, 0.5);

    for (let i = 0; i < size; i++) {
        let y1 = y0 + stepy * i;
        for (let j = 0; j < size; j++) {
            let x1 = x0 + stepx * j;
            if(datas[i][j] != 0){
                WriteText(datas[i][j] + "", x1, y1, fontHei);
            }
            
        }
    }

    //绘制边框线
    let x2 = x0 + stepx * (size - 1);
    let y2 = y0 + stepy * (size - 1);
    let hei = fontHei + 0.15;
    let margin = 0.4;
    for (let i = 0; i <= size; i++) {
        let linWidth = 0.02;
        if (i % sizeBox == 0) {
            linWidth = 0.07;
        }
        //horizontal
        DrawLine(x0 - margin, y0 - hei + stepy * i, x2 + hei, y0 - hei + stepy * i, linWidth);
        //vertical
        DrawLine(x0 - margin + stepx * i, y0 - hei, x0 - margin + stepx * i, y2 + margin, linWidth);
    }
}

//检查行 是否正确
function ValidRow(r, c, value) {
    for (let i = 0; i < size; i++) {
        if (i != c && datas[r][i] != 0 && datas[r][i] == value) {
            return false;
        }
    }
    return true;
}

//检查列 是否正确
function ValidColumn(r, c, value) {
    for (let i = 0; i < size; i++) {
        if (i != r && datas[i][c] != 0 && datas[i][c] == value) {
            return false;
        }
    }
    return true;
}

//检查Box 是否正确
function ValidBox(r, c, value) {
    let boxR = parseInt(r / sizeBox);
    let boxC = parseInt(c / sizeBox);

    for (let i = 0; i < size; i++) {
        let boxi = parseInt(i / sizeBox);
        for (let j = 0; j < size; j++) {
            let boxj = parseInt(j / sizeBox);
            //只判断在盒子范围内的值
            if (boxR == boxi && boxC == boxj) {
                //判断是否已经存在此值
                if ((i != r || j != c) && datas[i][j] != 0 && datas[i][j] == value) {
                    return false;
                }
            }
        }
    }

    return true;
}

//两行进行交换
function SwitchRows(r, r2) {
    if (r < 0 || r2 < 0) return;
    for (let i = 0; i < size; i++) {
        [datas[r][i], datas[r2][i]] = [datas[r2][i], datas[r][i]];
    }
}
//两列进行交换
function SwitchColumns(c, c2) {
    if (c < 0 || c2 < 0) return;
    for (let i = 0; i < size; i++) {
        [datas[i][c], datas[i][c2]] = [datas[i][c2], datas[i][c]];
    }
}

//随机生成 同一个宫内的值
function GetRandPosition(n) {
    if (n == undefined || n == null || n == -1) {
        return RandomInt(0, size - 1);
    } else {
        //生成的随机数 不能与 n相同，而且必须在同一个宫中
        let boxn = parseInt(n / sizeBox);
        for (let i = 0; i < 1000; i++) {
            let n2 = RandomInt(0, size - 1);
            let boxn2 = parseInt(n2 / sizeBox);
            if (n2 != n && boxn == boxn2) {
                return n2;
            }
        }
    }

    return -1;
}


//成行显示
function WriteTextsH(arr1, x, y, hei, scale) {
    let tbWid = 0;
    let x2 = x;
    for (let i = 0; i < arr1.length; ++i) {
        x2 = x2 + tbWid;
        WriteText(arr1[i], x2, y, hei, scale);
        //计算宽度
        tbWid = arr1[i].length * hei * 0.8;
    }
}

//绘制题目
function WriteText(str1, x, y, hei, scale) {
    scale = scale || 60;
    let fontHei = hei * scale + "px";
    ctx.font = "normal " + fontHei + " Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(str1, x * scale, y * scale);
}

function DrawLine(x1, y1, x2, y2, wid, scale) {
    scale = scale || 60;
    wid = wid || 0.1;
    ctx.lineWidth = wid * scale;
    ctx.strokeStyle = "black";
    //开始一个新的绘制路径
    ctx.beginPath();
    ctx.moveTo(x1 * scale, y1 * scale);
    ctx.lineTo(x2 * scale, y2 * scale);
    ctx.stroke();
    //关闭当前的绘制路径
    ctx.closePath();
}

//生成随机值
function RandomInt(min, max) {
    var span = max - min + 1;
    var result = Math.floor(Math.random() * span + min);
    return result;
}

//显示生成的题目图片，长按保存
function ShowImageDlg() {
    let strImg = "<img ";
    strImg += "src=" + canvas.toDataURL('png', 1.0);
    strImg += " style='width:350px;height:500px;'></img>";
    let dlg1 = new Dialog({
        title: "长按图片，保存下载",
        text: strImg
    });

    dlg1.Show();
}

//下载
function DownLoad() {
    //确定图片的类型  获取到的图片格式 data:image/Png;base64,......
    let type = 'jpeg';
    let imgdata = canvas.toDataURL(type, 1.0);
    //将mime-type改为image/octet-stream,强制让浏览器下载
    let fixtype = function (type) {
        type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
        let r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    };
    imgdata = imgdata.replace(fixtype(type), 'image/octet-stream');
    //将图片保存到本地
    let savaFile = function (data, filename) {
        let save_link = document.createElement('a');
        save_link.href = data;
        save_link.download = filename;
        let event = new MouseEvent('click');
        save_link.dispatchEvent(event);
    };

    let filename = '' + new Date().format('yyyy-MM-dd_hhmmss') + '.' + type;
    //用当前秒解决重名问题
    savaFile(imgdata, filename);
}

Date.prototype.format = function (format) {
    let o = {
        "y": "" + this.getFullYear(),
        "M": "" + (this.getMonth() + 1),  //month
        "d": "" + this.getDate(),         //day
        "h": "" + this.getHours(),        //hour
        "m": "" + this.getMinutes(),      //minute
        "s": "" + this.getSeconds(),      //second
        "S": "" + this.getMilliseconds(), //millisecond
    }
    return Object.keys(o).reduce((pre, k) => (new RegExp("(" + k + "+)").test(pre)) ? (pre.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : o[k].padStart(2, "0"))) : pre, format);
}

//绘制图片
function DrawImage(img0, cb) {
    let imgObj = new Image();
    imgObj.src = img0;
    imgObj.onload = function () {
        ctx.drawImage(imgObj, 25, 25, 150, 150);
        if (typeof cb == "function") {
            cb();
        }
    }
}