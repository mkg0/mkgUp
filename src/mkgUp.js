jQuery.fn.mkgUp=function(){
    if(!this.length) return this;
    //defaults
    var tipText=null;
    var actionType=null;//highlight,coverback,disable

    var options={
        tip:{
            position:'top',
            scroll:true,
            scrollSpeed:1, //speed ratio
            duration:1100,
            fadeSpeed:350,
            margin:5,
            onComplete:null,
            onScrollComplete:null,
            fixed:false
        },
        highlight:{
            duration:100,
            fadeSpeed:250,
            color:null,
            opacity:0.6,
            scroll:true,
            scrollSpeed:1, //speed ratio
            fixed:false,
            onScrollComplete:null,
            onComplete:null,
            tip:{
                scroll:false
            }
        },
        coverBack:{
            duration:500,
            fadeSpeed:250,
            color:null,
            opacity:0.7,
            scroll:true,
            closeOnClick:true,
            scrollSpeed:1, //speed ratio
            fixed:false,
            onScrollComplete:null,
            onComplete:null,
            tip:{
                scroll:false
            }
        },
        coverBackClose:{
            fadeSpeed:250,
            scroll:false,
            scrollSpeed:1, //speed ratio
            onScrollComplete:null,
            onComplete:null
        },
        disable:{
            duration:0,
            fadeSpeed:250,
            color:null,
            opacity:0.65,
            scroll:false,
            scrollSpeed:1, //speed ratio
            fixed:false,
            onScrollComplete:null,
            onComplete:null,
            tip:{
                scroll:false
            }
        },
        disableClose:{
            fadeSpeed:250,
            scroll:true,
            scrollSpeed:1, //speed ratio
            onScrollComplete:null,
            onComplete:null
        },
        disableToggle:{
            duration:0,
            fadeSpeed:250,
            color:null,
            opacity:0.65,
            scroll:false,
            scrollSpeed:1, //speed ratio
            fixed:false,
            onScrollComplete:null,
            onComplete:null,
            onEnabled:null,
            onDisabled:null,
            tip:{
                scroll:false
            }
        },
        loading:{
            duration:0,
            fadeSpeed:250,
            color:null,
            opacity:0.95,
            scroll:false,
            scrollSpeed:1, //speed ratio
            fixed:false,
            onScrollComplete:null,
            onComplete:null,
            onLoaded:null,
            autoClose:true, //detect dom changes and close the loading
            tip:{
                scroll:false
            }
        },
        loadingClose:{
            fadeSpeed:250,
            scroll:false,
            scrollSpeed:1, //speed ratio
            onScrollComplete:null,
            onComplete:null
        }
    }

    var isItAction = function(value){
        for(var key in options)
            if(key === value) return true;
        return false;
    }

    var observeDOM = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback){
            if( MutationObserver ){
                // define a new observer
                var obs = new MutationObserver(function(mutations, observer){
                    if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                        callback();
                });
                // have the observer observe foo for changes in children
                obs.observe( obj, { childList:true, subtree:true });
            }
            else if( eventListenerSupported ){
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        }
    })();


    //init options
    for (var i = 0; i < arguments.length; i++) {
        if(typeof arguments[i] === 'string'){
            if(isItAction(arguments[i]) && !actionType)
                actionType= arguments[i];
            else
                tipText=arguments[i];
        }else if(typeof arguments[i] === 'object'){
            $.extend(true,options[actionType],arguments[i])
        }else if(typeof arguments[i] === 'function'){
            options[actionType].onComplete= arguments[i];
        }
    }
    if(!actionType) actionType='highlight';

    //lets get start!
    var calcScrollPos= function(target){
        let windowH = $(window).height();//$(window).height() "html doctype" olmazsa yanlýþ deðer döndürüyor
        let documentH = $(document).height();
        let scrollPos = $(target).offset().top - windowH * 0.2;//define scroll PosY for target viewing(adding 20% top space)
        if(scrollPos<0) scrollPos=0;
        if(scrollPos+ windowH > documentH) scrollPos = documentH - windowH; //if there is not area for scroll fit to bottom
        return scrollPos;
    }
    var calcScrollSpeed = function(targetPos){
        let distance=Math.abs(targetPos - $('body').scrollTop());
        return 400 + distance * 0.40;
    }

    var actions={
        highlight(){
            let target= $(this);
            if(!target.attr('id'))
                target.attr('id', 'mkgUp-target' + Date.now())
            if(target.is('input,textarea,select')) target.select();
            let perdeID= 'mkgUp_highlight-' + Date.now();
            let perde = $(`<div class="mkgUp_highlight" id="${perdeID}"></div>`);
            let styles = `top:${ options.highlight.fixed ? target.offset().top - $(window).scrollTop() : target.offset().top }px;left:${target.offset().left}px;width:${target.outerWidth()}px;height:${target.outerHeight()}px;`;
                if(options.highlight.fixed) styles += ';position:fixed';
                if(options.highlight.color) styles += ';background-color:' + options.highlight.color;
            perde.attr('style',styles).appendTo('body').fadeTo(options.highlight.fadeSpeed,options.highlight.opacity, ()=> {
                if(tipText){
                    $.extend(options.tip, options.highlight.tip)
                    actions.tip.call(this);
                }
                if(options.highlight.duration > 0)
                    setTimeout(
                        ()=>{
                            perde.fadeOut(options.highlight.fadeSpeed, ()=>
                                {
                                    if(options.highlight.onComplete)
                                        options.highlight.onComplete.call(this);
                                    perde.remove();
                                }
                            )
                        },options.highlight.duration
                    );
                else if(options.highlight.onComplete)
                    options.highlight.onComplete.call(this);
            });
        },
        coverBack(){
            let target= $(this);
            if(target.is('input,textarea,select')) target.select();
            let perdeID= 'mkgUp_coverback-' + Date.now();
            let offset = target.offset();
            if(!target.attr('id'))
                target.attr('id', 'mkgUp-target' + Date.now())
            let perde = $(`
            <div class="mkgUp_coverback" id="${perdeID}" target="${target.attr('id')}">
                <div class="mkgUp_coverback-top" style="${options.coverBack.fixed ? 'position:fixed;' : ''}left:${offset.left}px;width:${ target.outerWidth() }px;height:${options.coverBack.fixed ? offset.top - $(window).scrollTop() : offset.top}px"></div>
                <div class="mkgUp_coverback-right" style="${options.coverBack.fixed ? 'position:fixed;' : ''}left:${offset.left + target.outerWidth()}px;width:${ $(window).width() - offset.left - target.outerWidth()}px;height:${ $(document).height()}px"></div>
                <div class="mkgUp_coverback-bottom" style="${options.coverBack.fixed ? 'position:fixed;' : ''}top:${options.coverBack.fixed ? offset.top + target.outerHeight() - $(window).scrollTop() : offset.top + target.outerHeight() }px;left:${offset.left}px;width:${ target.outerWidth() }px;height:${ $(document).height() - offset.top - target.outerHeight()}px"></div>
                <div class="mkgUp_coverback-left" style="${options.coverBack.fixed ? 'position:fixed;' : ''}width:${offset.left}px;height:${ $(document).height()}px"></div>
            </div>`);
            perde.appendTo('body').fadeTo(options.coverBack.fadeSpeed,options.coverBack.opacity, ()=> {
                if(tipText){
                    $.extend(options.tip, options.coverBack.tip)
                    actions.tip.call(this);
                }
                if(options.coverBack.duration > 0)
                    setTimeout(()=> perde.stop().fadeOut(options.coverBack.fadeSpeed, ()=> {
                        if(options.coverBack.onComplete)
                            options.coverBack.onComplete.call(this);
                    }) ,options.coverBack.duration);
                else if(options.coverBack.onComplete)
                    options.coverBack.onComplete.call(this);
            });
        },
        coverBackClose(){
            let target= $(this);
            let perde=$('.mkgUp_coverback[target="' + target.attr('id') + '"]');
            perde.stop().fadeOut(options.coverBackClose.fadeSpeed,
                ()=>{
                    perde.remove();
                    if (options.coverBackClose.onComplete) options.coverBackClose.onComplete.call(this);
                }
            );
        },
        disable(){
            let target= $(this);
            if(!target.attr('id'))
                target.attr('id', 'mkgUp-target' + Date.now())
            let perdeID= 'mkgUp_disable-' + Date.now();
            let perde = $(`<div class="mkgUp_disable" id="${perdeID}" target="${target.attr('id')}"></div>`);
            if($('.mkgUp_disable[target="' + target.attr('id') + '"]').length)
                perde=$('.mkgUp_disable[target="' + target.attr('id') + '"]');
            let styles = `top:${options.disable.fixed ? target.offset().top - $(window).scrollTop() : target.offset().top}px;left:${target.offset().left}px;width:${target.outerWidth()}px;height:${target.outerHeight()}px;`;
                if(options.disable.fixed) styles += ';position:fixed';
                if(options.disable.color) styles += ';background-color:' + options.disable.color;
            perde.attr('style',styles)
                .appendTo('body')
                .fadeTo(options.disable.fadeSpeed,options.disable.opacity, ()=> {
                    if(tipText){
                        $.extend(options.tip, options.disable.tip)
                        actions.tip.call(this);
                    }

                    if(options.disable.duration > 0)
                        setTimeout(
                            ()=>{
                                perde.fadeOut(options.disable.fadeSpeed, ()=>
                                    {
                                        if(options.disable.onComplete)
                                            options.disable.onComplete.call(this);
                                        perde.remove();
                                    }
                                )
                            },options.disable.duration
                        );
                    else if(options.disable.onComplete)
                        options.disable.onComplete.call(this);
                });
        },
        disableClose(){
            let target= $(this);
            let perde=$('.mkgUp_disable[target="' + target.attr('id') + '"]');
            perde.fadeOut(options.disableClose.fadeSpeed,
                ()=>{
                    perde.remove();
                    if (options.disableClose.onEnabled) options.disableClose.onEnabled.call(this);
                    if (options.disableClose.onComplete) options.disableClose.onComplete.call(this);
                }
            );
        },
        disableToggle(){
            let target= $(this);
            if(!target.attr('id'))
                target.attr('id', 'mkgUp-target' + Date.now())
            if($('.mkgUp_disable[target="' + target.attr('id') + '"]').length){
                options.disableClose= options.disableToggle;
                actions.disableClose.call(this);
            }else{
                options.disable= options.disableToggle;
                actions.disable.call(this);
            }

        },
        loading(){
            let target= $(this);
            if(!target.attr('id'))
                target.attr('id', 'mkgUp-target' + Date.now())

            let perdeID= 'mkgUp_disable-' + Date.now();
            let perde = $(`<div class="mkgUp_loading" id="${perdeID}" target="${target.attr('id')}"></div>`);
            if($('.mkgUp_loading[target="' + target.attr('id') + '"]').length)
                perde=$('.mkgUp_loading[target="' + target.attr('id') + '"]');
            let styles = `top:${options.loading.fixed ? target.offset().top - $(window).scrollTop() : target.offset().top}px;left:${target.offset().left}px;width:${target.outerWidth()}px;height:${target.outerHeight()}px;`;
                if(options.loading.fixed) styles += ';position:fixed';
                if(options.loading.color) styles += ';background-color:' + options.loading.color;
            perde.attr('style',styles)
                .appendTo('body')
                .fadeTo(options.loading.fadeSpeed,options.loading.opacity, ()=> {
                    if(tipText){
                        $.extend(options.tip, options.loading.tip)
                        actions.tip.call(this);
                    }
                    if(options.loading.duration > 0)
                        setTimeout(
                            ()=>{
                                perde.fadeOut(options.loading.fadeSpeed, ()=>
                                    {
                                        if(options.loading.onComplete)
                                            options.loading.onComplete.call(this);
                                        perde.remove();
                                    }
                                )
                            },options.loading.duration
                        );
                    else{
                        if(options.loading.onComplete) options.loading.onComplete.call(this);
                        target.each(function(){
                            observeDOM(this, ()=> {
                                if(options.loading.autoClose)
                                    actions.loadingClose.call(this);
                                if(options.loading.onLoaded)
                                    options.loading.onLoaded.call(this);
                            });
                        })
                    }
                });
        },
        loadingClose(){
            let target= $(this);
            let perde=$('.mkgUp_loading[target="' + target.attr('id') + '"]');
            perde.stop().fadeOut(options.loadingClose.fadeSpeed,
                ()=>{
                    perde.remove();
                    if (options.loadingClose.onEnabled) options.loadingClose.onEnabled.call(this);
                    if (options.loadingClose.onComplete) options.loadingClose.onComplete.call(this);
                }
            );
        },
        tip(){
            let target= $(this);
            if(target.is('input,textarea,select')) target.select();
            let tipID= 'mkgUp_tip-' + Date.now();
            let tip = $(`<div class="mkgUp_tip mkgUp_tip--${options.tip.position}" id="${tipID}" target="${target.attr('id')}">${tipText}</div>`);
            tip.appendTo('body');
            let left;
            let top;
            let styles;
            if (options.tip.position === 'top') {
                top= options.tip.fixed ? target.offset().top - $(window).scrollTop() : target.offset().top;
                left=target.offset().left + target.outerWidth()/2;
                top-=tip.outerHeight();
                left-=tip.outerWidth()/2;
                top-= options.tip.margin;
            }else if (options.tip.position === 'right') {
                top= options.tip.fixed ? target.offset().top + target.outerHeight()/2 - $(window).scrollTop() : target.offset().top + target.outerHeight()/2 ;
                left=target.offset().left + target.outerWidth();
                top-=tip.outerHeight()/2;
                left+= options.tip.margin;
            }else if (options.tip.position === 'bottom') {
                top=options.tip.fixed ? target.offset().top + target.outerHeight() - $(window).scrollTop() : target.offset().top + target.outerHeight();
                left=target.offset().left + target.outerWidth()/2;
                left-=tip.outerWidth()/2;
                top+= options.tip.margin;
            }else if (options.tip.position === 'left') {
                top=options.tip.fixed ? target.offset().top + target.outerHeight()/2 - $(window).scrollTop() : target.offset().top + target.outerHeight()/2;
                left=target.offset().left;
                top-=tip.outerHeight()/2;
                left-=tip.outerWidth();
                left-= options.tip.margin;
            }else if (options.tip.position === 'center') {
                top=options.tip.fixed ? target.offset().top + target.outerHeight()/2 - $(window).scrollTop() : target.offset().top + target.outerHeight()/2;
                left=target.offset().left + target.outerWidth()/2;
                top-=tip.outerHeight()/2;
                left-=tip.outerWidth()/2;
                if(actionType==='loading') top+=60;
            }
            if(left<0) left= 0;
            if(top<0) top= 0;
            if(left + tip.outerWidth() > $(window).width()) left= $(window).width() - tip.outerWidth();

            if(options.tip.fixed) styles += ';position:fixed';
            tip.attr('style',`top:${top}px;left:${left}px;${styles}`);
            if(options.tip.duration > 0)
                setTimeout(()=> tip.fadeOut(options.tip.fadeSpeed, ()=> {
                    if(options.tip.onComplete)
                        options.tip.onComplete.call(this);
                }) ,options.tip.duration);
            else if(options.tip.onComplete)
                options.tip.onComplete.call(this);
        }
    }


    let actionOptions = options[actionType];
    if((actionOptions.scroll && !actionOptions.fixed) ){
        var targetScrollPos=calcScrollPos(this);
        $('body').stop().animate({scrollTop: targetScrollPos}, calcScrollSpeed(targetScrollPos) / actionOptions.scrollSpeed, () =>{
            if(actionOptions.onScrollComplete) actionOptions.onScrollComplete.call(this.get());
            this.each(function(){
                actions[actionType].call(this);
            })
        })
    }else{
        this.each(function(){
            actions[actionType].call(this);
        })
    }
    return this;
}
