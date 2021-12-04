'use strict'

const player = $("#player")[0];
const filterSelect = $("#filter")[0];

start();

// 選擇不同的濾鏡效果
filterSelect.onchange = function(){
    player.className = filterSelect.value;
}

function start(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('不支採集音視頻數據！');
    }else{
        // 採集音視頻數據
        var constrants = {
            video:true,
            audio:true
        };
        navigator.mediaDevices.getUserMedia(constrants).then(gotMediaStream).catch(handleError);
    }
}

// 採集音視頻數據成功時調用的方法
function gotMediaStream(stream){
    
    player.srcObject = stream;
}

// 採集音視頻數據失敗時調用的方法
function handleError(err){
    console.log(err.name+':'+err.message);
}