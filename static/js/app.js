
var currentRecord = null;
var currentSong = 0;
var progress;
var currentTime;
var errorLinstener = false;
var timeJumpping = false;

function customHeader(){
    $('header').css('height',$(window).innerHeight() - 70);

    $(window).resize(function () {
        $('header').css('height',$(window).innerHeight() - 70);
    });
}

$(document).ready(function(){

    var AUDIO = $('#player');

    function showToast(mes){
        var timeStamp = Date.parse(new Date());
        var toast = $('<div class="toast" id="toast-'+timeStamp+'">'+mes+'</div>');
        $('body').append(toast);
        setTimeout(function () {
            $('#toast-'+timeStamp).remove();
        },5000);
    }

    function playMusic(recordId){
        if (recordId == currentRecord){
            AUDIO[0].play();
        }else{
            AUDIO.attr('src','https://music.163.com/song/media/outer/url?id='+$('#play-'+recordId).find('.songlist .songitem').eq(currentSong).attr('data-id')+'.mp3');
            AUDIO[0].play();
            currentRecord = recordId;
        }
        if (!errorLinstener){
            AUDIO[0].addEventListener('error',function () {
                showToast('播放错误，将自动播放下一首。');
                clearInterval(progress);
                nextMusic();
            });
            errorLinstener = !errorLinstener;
        }
    }

    function playSongitem(recordId,songId) {
        if (recordId == currentRecord){
            if (songId != currentSong){
                currentSong = parseInt(songId);
                if (!errorLinstener){
                    AUDIO[0].addEventListener('error',function () {
                        showToast('播放错误，将自动播放下一首。');
                        clearInterval(progress);
                        nextMusic();
                    });
                    errorLinstener = !errorLinstener;
                }
                AUDIO.attr('src','https://music.163.com/song/media/outer/url?id='+$('#play-'+recordId).find('.songlist .songitem').eq(currentSong).attr('data-id')+'.mp3');
                AUDIO[0].play();
            }
        } else{
            currentRecord = recordId;
            currentSong = parseInt(songId);
            currentSong = parseInt(songId);
            if (!errorLinstener){
                AUDIO[0].addEventListener('error',function () {
                    showToast('播放错误，将自动播放下一首。');
                    clearInterval(progress);
                    nextMusic();
                });
                errorLinstener = !errorLinstener;
            }
            AUDIO.attr('src','https://music.163.com/song/media/outer/url?id='+$('#play-'+recordId).find('.songlist .songitem').eq(currentSong).attr('data-id')+'.mp3');
            AUDIO[0].play();
        }
    }

    function pauseMusic(){
        AUDIO[0].pause();
    }

    function preMusic() {
        if (!currentRecord){
            showToast('当前音乐为空，请点击歌单进行播放！');
            return;
        }
        if (currentSong == 0){
            showToast('已经是第一首！')
            return;
        }
        currentSong -= 1;
        AUDIO.attr('src','https://music.163.com/song/media/outer/url?id='+$('#play-'+currentRecord).find('.songlist .songitem').eq(currentSong).attr('data-id')+'.mp3');
        AUDIO[0].play();
    }

    function nextMusic(){
        currentSong += 1;
        if (currentSong >= $('#play-'+currentRecord).find('.songlist .songitem').length){
            currentSong = 0;
            showToast('将重新播放此歌单!');
        }
        AUDIO.attr('src','https://music.163.com/song/media/outer/url?id='+$('#play-'+currentRecord).find('.songlist .songitem').eq(currentSong).attr('data-id')+'.mp3');
        AUDIO[0].play();
    }

    $('.playcontrol .play').click(function () {
        var recordId = $(this).parents('.playitem:first').attr('data-id');
        if (currentRecord == null){
            currentRecord == recordId;
        }
        if (recordId != currentRecord){
            currentSong = 0;
            playMusic(recordId);
            return;
        }
        if (AUDIO[0].paused){
            playMusic(recordId);
        }else{
            pauseMusic();
        }
    });

    $('.playcontrol .list').click(function () {
        $('body').css('overflow-y','hidden');
        var record = $(this).parents('.playitem:first');
        var recordId = record.attr('data-id');
        var songlist = record.find('.songlist .songitem');
        var length = songlist.length;

        $('.songlist-wrapper .record-cover').attr('style',record.find('.playcover:first').attr('style'));
        $('.songlist-wrapper .record-name').text(record.find('.playname:first').text());
        $('.songlist-wrapper .record-description').text(record.find('.playdescription:first').text());

        if (recordId != $('.songlist-wrapper .songlist:first').attr('data-for')){
            $('.songlist-content').empty();
            $('.songlist-content').append('<ul class="songlist" id="for-'+recordId+'" data-for="'+recordId+'"></ul>');
            var single;
            for (var n=0;n<length;n++){
                single = $('<li class="songitem" data-id="'+songlist.eq(n).attr('data-id')+'" data-name="'+songlist.eq(n).attr('data-name')+'" data-author="'+songlist.eq(n).attr('data-author')+'" data-cover="'+songlist.eq(n).attr('data-cover')+'"><div class="song-cover"><div class="item-playing"><img src="./static/img/music-light.svg"></div><img src="'+songlist.eq(n).attr('data-cover')+'"></div><div class="songitem-meta"><h3>'+songlist.eq(n).attr('data-name')+'</h3><p>'+songlist.eq(n).attr('data-author')+'</p></div><div class="play-button"><img src="./static/img/play-light.svg" alt=""></div></li>')
                $('.songlist-content .songlist').append(single);
            }
        }
        $('#for-'+currentRecord).find('.songitem').eq(currentSong).addClass('songitem-playing');
        $('.songlist-wrapper .songitem').click(function(){
            var recordId = $(this).parents('.songlist:first').attr('data-for');
            playSongitem(recordId,$(this).index());
        });

        $('.record-songlist').css('opacity','1');
        $('.record-songlist').css('pointer-events','auto');

    });

    $('.playbar-wrapper .list').click(function () {
        $('body').css('overflow-y','hidden');
        var record = $('#play-'+currentRecord);
        var recordId = currentRecord;
        var songlist = record.find('.songlist .songitem');
        var length = songlist.length;

        $('.songlist-wrapper .record-cover').attr('style',record.find('.playcover:first').attr('style'));
        $('.songlist-wrapper .record-name').text(record.find('.playname:first').text());
        $('.songlist-wrapper .record-description').text(record.find('.playdescription:first').text());

        $('.songlist-wrapper .songitem').unbind('click');

        if (recordId != $('.songlist-wrapper .songlist:first').attr('data-for')){
            $('.songlist-content').empty();
            $('.songlist-content').append('<ul class="songlist" id="for-'+recordId+'" data-for="'+recordId+'"></ul>');
            var single;
            for (var n=0;n<length;n++){
                single = $('<li class="songitem" data-id="'+songlist.eq(n).attr('data-id')+'" data-name="'+songlist.eq(n).attr('data-name')+'" data-author="'+songlist.eq(n).attr('data-author')+'" data-cover="'+songlist.eq(n).attr('data-cover')+'"><div class="song-cover"><div class="item-playing"><img src="./static/img/music-light.svg"></div><img src="'+songlist.eq(n).attr('data-cover')+'"></div><div class="songitem-meta"><h3>'+songlist.eq(n).attr('data-name')+'</h3><p>'+songlist.eq(n).attr('data-author')+'</p></div><div class="play-button"><img src="./static/img/play-light.svg" alt=""></div></li>')
                $('.songlist-content .songlist').append(single);
            }
        }
        $('#for-'+currentRecord).find('.songitem').eq(currentSong).addClass('songitem-playing');
        $('.songlist-wrapper .songitem').click(function(){
            var recordId = $(this).parents('.songlist:first').attr('data-for');
            playSongitem(recordId,$(this).index());
        });

        $('.record-songlist').css('opacity','1');
        $('.record-songlist').css('pointer-events','auto');
    });

    $('.close-record-songlist').click(function () {
        $('.record-songlist').css('opacity','0');
        $('.record-songlist').css('pointer-events','none');
        $('.songlist-wrapper .songitem').unbind('click');
        $('body').css('overflow-y','auto');
    });

    $('.playcontrol .next').click(function () {
        var recordId = $(this).parents('.playitem:first').attr('data-id');
        if (recordId != currentRecord){
            currentSong = 0;
            playMusic(recordId);
        }else{
            nextMusic();
        }
    });

    $('.progress').mousedown(function (e) {
        timeJumpping = true;
        clearInterval(progress);
        var totalTime = AUDIO[0].duration;
        var jumpTime = e.pageX / $('.progress').width() * totalTime;
        $('body').css('pointer-events','none');
        $('body').css('-webkit-user-select','none');
        $('body').css('-moz-user-select','none');
        $('body').css('-ms-user-select','none');
        $('body').css('user-select','none');
        $('.progress-bar').css('width',e.pageX / $('.progress:first').width() * 100 + '%');
        $(document).mousemove(function (e2) {
            $('.progress-bar').css('width',e2.pageX / $('.progress:first').width() * 100 + '%');
        });
        $(document).mouseup(function (e3) {
            $(document).unbind('mouseup');
            $('body').css('pointer-events','auto');
            $('body').css('-webkit-user-select','auto');
            $('body').css('-moz-user-select','auto');
            $('body').css('-ms-user-select','auto');
            $('body').css('user-select','auto');
            timeJumpping = false;
            jumpTime = e3.pageX / $('.progress').width() * totalTime;
            $(document).unbind('mousemove');
            AUDIO[0].currentTime = jumpTime;
            $('.playbar .currenttime').text(new Date(Math.round(jumpTime) * 1000).toLocaleString().replace(/1970.*8:/g, ""));
        });
    });

    $('.playbar-playcontrol .next').click(function () {
        nextMusic();
    });

    $('.playbar-playcontrol .pre').click(function () {
        preMusic();
    });

    $('.playbar-playcontrol .play').click(function () {
        if (!currentRecord){
            showToast('当前音乐为空，请点击歌单进行播放！');
            return;
        }
        if (AUDIO[0].paused){
            playMusic(currentRecord);
        }else{
            pauseMusic();
        }
    });

    AUDIO[0].addEventListener('playing',function () {
        $('.musiccover').attr('src',$('#play-'+currentRecord).find('.songlist .songitem').eq(currentSong).attr('data-cover'));
        $('.music-name').text($('#play-'+currentRecord).find('.songlist .songitem').eq(currentSong).attr('data-name'));
        $('.music-author').text($('#play-'+currentRecord).find('.songlist .songitem').eq(currentSong).attr('data-author'));
        $('.playbar').css('display','block');
        $('.playcontrol').find('.play img').attr('src','./static/img/play-dark.svg');
        $('.playcontrol').removeClass('playing');
        $('#play-'+currentRecord).find('.playcontrol .play img').attr('src','./static/img/pause-dark.svg')
        $('#play-'+currentRecord).find('.playcontrol').addClass('playing');
        $('.playbar-playcontrol .play').find('img').attr('src','./static/img/pause-light.svg');
        $('#for-'+currentRecord).find('.songitem').removeClass('songitem-playing');
        $('#for-'+currentRecord).find('.songitem').eq(currentSong).addClass('songitem-playing');

        progress =  window.setInterval(function () {
            if(!timeJumpping){
                $('.progress-bar').css('width',AUDIO[0].currentTime/AUDIO[0].duration*100 + '%');
            }
        },100);

        $('.totaltime').text(new Date(Math.round(AUDIO[0].duration) * 1000).toLocaleString().replace(/1970.*8:/g, ""));
        currentTime =  window.setInterval(function () {
            $('.playbar .currenttime').text(new Date(Math.round(AUDIO[0].currentTime) * 1000).toLocaleString().replace(/1970.*8:/g, ""))
        },1000);

        $.cookie('currentRecord', currentRecord, { expires: 15});
        $.cookie('currentSong', currentSong, { expires: 15});
    });

    AUDIO[0].addEventListener('pause',function () {
        $('.playcontrol').find('.play img').attr('src','./static/img/play-dark.svg');
        $('.playbar-playcontrol .play').find('img').attr('src','./static/img/play-light.svg');;
        $('.playcontrol').removeClass('playing');
    })

    AUDIO[0].addEventListener('ended',function () {
        clearInterval(progress);
        clearInterval(currentTime);
        $('.playbar .currenttime').text($('.totaltime').text());
        nextMusic();
    });


});

