/*

@author: Mauricio Rocha
plugin: vtex_super_menu

purpose:    Build a menu from a configuration file and xmls. Also add a collection to the menu.
             
use:
    jQuery("#container").vtex_super_menu({
        url:"/arquivos/menu-configuracao.xml"
    });
    
options:
    url: "/arquivos/menu-configuracao.xml" // Required. This is the path of the configuration file.
    mount: "all" // Default is 'all'. This option will load and mount 'all' options of the menus.
    

*** The configuration must follow the sample below. ****
Menu;/url-for-the-menu;/path/to/menu/xml;/path/to/collection;

configuration file: 

    Alimentação;/alimentacao;/menu/header/alimentacao;/menu/colecoes/alimentacao;
    Bem Estar;/bem-estar;/menu/header/bemestar;/menu/colecoes/bemestar;

    
*/
(function( $ ) {
    $.fn.vtex_super_menu = function(options){
    
        var _pm_container = $(this);
    
        var _pm_settings = $.extend({
            url:null,
            mount: 'all',
            each:null, // callback after each menu done.
            callback:null, // callback after all menu done.
            collection_title: '',
            show_collection: false,
            effect: false,
            selection: "ul > li > div",
            shadow: 0
        }, options);
        
        var _sm_plugin = {
            data:null,
            menus:[],
            urls:[],
            init: function()
            {
                if(_sm_plugin.check(_pm_container))
                    _sm_plugin.load.dependency();
            },
            set:
            {
                event:
                {
                    menu: function()
                    {
                        jQuery(_pm_container).find('li').mouseenter(function(){
                            _menu=jQuery(this).find('a').attr('menu');
                            _url=jQuery(this).find('a').attr('url');
                            _collection=jQuery(this).find('a').attr('collection');
                            _show=true;
                            _sm_plugin.submenu.show(_menu,_url,_collection,_show);
                        });
                        jQuery(_pm_container).find('li').mouseleave(function(){
                            _sm_plugin.effect.mouseleave(this);
                            _sm_plugin.submenu.hide();
                        });
                        
                        if(_pm_settings.mount=='all')
                            _sm_plugin.submenu.all();

                    }
                },
                config: function()
                {
                    var rows = _sm_plugin.data.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
                    var list;
                    jQuery(rows).each(function(ndx,item){
                        if(item.length<=0) return true; // skip
                        list={};
                        item_clean = item.replace(/&amp;/g,'&');
                        itens = item_clean.split(";");
                        list.menu = itens[0];
                        _menu_url = itens[1]||"";
                        // _menu_url = _menu_url.replace(/&(?!amp;)/g,"&amp;");
                        list.menu_url = _menu_url;
                        list.url = itens[2]||"";
                        list.collection_url = itens[3]||"";
                        list.icon = itens[4]||"";
                        _sm_plugin.urls.push(itens[2]);
                        _sm_plugin.menus.push(list);
                    });

                    _sm_plugin.set.menus();
                },
                menus: function()
                {
                    _ul=jQuery('<ul>');
                    jQuery(_sm_plugin.menus).each(function(ndx,item){
                        _li=jQuery('<li>').addClass("sp-container").addClass("sp-container-"+ndx);
                        _text=item.menu;
                        _menu=_text.accentsTidy();
                        _url=item.url;
                        menu_url=item.menu_url;
                        _collection=item.collection_url;
                        _icon=item.icon;
                        if(_icon!="")
                        { 
                          img = jQuery('<img/>').attr('src',_icon);
                          span_img = jQuery('<span/>').addClass('_img');
                          span = jQuery('<span/>').html(_text);
                          jQuery(span_img).append(img);  
                          _a=jQuery('<a>').attr('role','link').addClass("sp-item").addClass("sp-item-"+ndx).addClass("sp-"+_menu).attr({'url':_url,'href':menu_url,'menu':_menu,'collection':_collection}).append(span_img).append(span);
                        }else{
                          _a=jQuery('<a>').attr('role','link').addClass("sp-item").addClass("sp-item-"+ndx).addClass("sp-"+_menu).attr({'url':_url,'href':menu_url,'menu':_menu,'collection':_collection}).html(_text);
                        }
                        jQuery(_li).append(_a);
                        
                        if(_url)
                        {
                            _div_wrapper=jQuery('<div>').addClass('sp-submenu-wrapper').addClass('sp-submenu-wrapper-'+ndx).addClass('sp-submenu-wrapper-'+_menu);
                            _div=jQuery('<div>').addClass('sp-submenu').addClass('sp-submenu-'+ndx).addClass('sp-submenu-'+_menu);
                            
                            _div_collection=jQuery('<div>').addClass('sp-collection').addClass('sp-collection-'+ndx).addClass('sp-collection-'+_menu);
                            _div_collection_title=jQuery('<div>').addClass('sp-collection-title').addClass('sp-collection-title-'+ndx).addClass('sp-collection-title-'+_menu);
                            _div_collection_container=jQuery('<div>').addClass('sp-collection-container').addClass('sp-collection-container-'+ndx).addClass('sp-collection-container-'+_menu);
                            
                            jQuery(_div_collection).append(_div_collection_title).append(_div_collection_container);
                            jQuery(_div_wrapper).append(_div).append(_div_collection);
                            jQuery(_li).append(_div_wrapper);
                        }
                        jQuery(_ul).append(_li);
                    });

                    jQuery(_pm_container).empty().append(_ul);
                    
                    _sm_plugin.set.event.menu();
                }
            },
            submenu:
            {
                show: function(_menu,_url,_collection,_show)
                {
                    _submenu = jQuery('.sp-submenu-'+_menu);
                    if(_submenu.is(':empty')&&!_submenu.hasClass('loaded'))
                    {
                        _submenu.addClass('loaded');
                        _sm_plugin.load.submenu(_menu,_url,_show);
                        if(_pm_settings.show_collection)
                            _sm_plugin.load.collection(_menu,_url,_collection);
                    }
                    else
                    {
                        _submenu.parent().parent().addClass('active');
                        _sm_plugin.effect.mouseenter(_submenu.parent());
                        _sm_plugin.submenu.fix(_submenu.parent());
                    }
                    
                },
                hide: function(e)
                {
                    _menu = jQuery(_pm_container).find('li').removeClass('active');
                },
                fix: function(e)
                {
                    if(jQuery(e).length<=0) return false;
                    if(jQuery(e).hasClass('fixed')) return false;
                    
                    jQuery(e).addClass('fixed');
                    _parent = jQuery(e).parents('li').parents('div');
                    _parent_w = jQuery(e).parents('li').parents('div').width();
                    shadow_padding=_pm_settings.shadow;
                    
                    this_offset_left = jQuery(e).offset().left;
                    if(_sm_plugin.get.browser()=="ie7")
                        this_offset_left = this_offset_left-jQuery(e).position().left;
                        
                    left=-1*(this_offset_left+jQuery(e).outerWidth()-_parent.offset().left-_parent_w+shadow_padding);
                        
                    if(left<0)
                        jQuery(e).css({left:left+'px'});
                },
                all: function()
                {
                    jQuery(_pm_container).find('a.sp-item').each(function(ndx,item){
                        _menu=jQuery(this).attr('menu');
                        _url=jQuery(this).attr('url');
                        _collection=jQuery(this).attr('collection');
                        _show=false;
                        _sm_plugin.submenu.show(_menu,_url,_collection,_show);
                    });
                }
            },
            load:
            {
                dependency: function()
                {
                    if(typeof vtex_xml_menu=="undefined")
                        jQuery.getScript("/arquivos/vtex_xml_menu.js",function(){
                            _sm_plugin.load.config();
                        });
                    else
                        _sm_plugin.load.config();
                },
                config: function()
                {
                    jQuery.ajax({
                        dataType: 'text',
                        url: _pm_settings.url,
                        success: function(data)
                        {
                            if(data!=null)
                            {
                                _sm_plugin.data = data;
                                _sm_plugin.set.config();
                            }
                            else
                                _sm_plugin.log("Arquivo não encontrado!\nInserir arquivo \""+_pm_settings.url+"\".");

                        }
                    });
                },
                submenu: function(_menu,_url,_show)
                {
                    _submenu = jQuery(".sp-submenu-"+_menu);
                    if(!_submenu.is(':empty')) return;

                    jQuery(_submenu).vtex_xml_menu({
                            url:_url,
                            callback:function()
                            {
                                if(typeof _pm_settings.each=="function") 
                                    _pm_settings.each(_menu); // Argument is current menu.
                            }
                        });
                    
                    if(_show){
                        _submenu.parent().parent().addClass('active');
                        // _sm_plugin.effect.mouseenter(_submenu);
                    }
                        
                    if(_sm_plugin.urls.length-1>0)
                        _sm_plugin.urls.remove(_url);
                    else       
                        if(typeof _pm_settings.callback=="function")
                            _pm_settings.callback();

                },
                collection: function(_menu,_url,_collection_url)
                {
                    var selection = _pm_settings.selection||"";
                    if(typeof _collection_url=="string" && _collection_url.replace(/^\s*([\S\s]*?)\s*$/, '$1')!="")
                        jQuery(".sp-collection-container-"+_menu).load(_collection_url+" "+selection,function(){
                            jQuery(".sp-collection-container-"+_menu+":not(':empty')").parent().addClass('active').parent().addClass('sp-collection-on');

                            if(_pm_settings.collection_title!=""&&jQuery(".sp-collection-container-"+_menu).parent().hasClass('active'))
                                jQuery(".sp-collection-title-"+_menu).append(_pm_settings.collection_title);
                        });
                }
            },
            effect:
            {
                mouseenter:function(e)
                {
                    if (_pm_settings.effect)
                        $(e).stop(true, true).fadeIn("slow");
                    else
                        $(e).show();
                },
                mouseleave:function(e)
                {
                    if (_pm_settings.effect)
                        $(e).find('.sp-submenu-wrapper').stop(true, true).fadeOut("fast");
                    else
                        $(e).find('.sp-submenu-wrapper').hide();
                }
            },
            check: function(e)
            {
                var result = false;
                
                if(jQuery(e).length<=0) // This checks if the container is set. Otherwise, nothing will happen.
                {
                    _sm_plugin.log("A container is required to build the menu.");
                    result = false;
                    return result;
                }
                
                if( _pm_settings.url!=null ) // This checks if the url is set. Otherwise, nothing will happen.
                {
                    _pm_container = e;
                    result = true;
                } else {
                    _sm_plugin.log("A URL is required to load menu.");
                }
                
                return result;
            },
            get:
            {
                browser: function()
                {
                    var browser = jQuery.browser.msie?'ie':/(chrome)/.test(navigator.userAgent.toLowerCase())?'chrome':jQuery.browser.mozilla?'fx':'other';
                    var version = jQuery.browser.version.split('.').shift();
                    return browser+version;
                }
            },
            log: function(log)
            {
                if(typeof console=="undefined") return;
                
                console.debug(log);
            }
        }
        
        return _sm_plugin.init();
    }
})( jQuery );

String.prototype.accentsTidy = function(){
    var s = this;
    var r=s.toLowerCase();
    r = r.replace(new RegExp(/\s/g),"");
    r = r.replace(new RegExp(/[àáâãäå]/g),"a");
    r = r.replace(new RegExp(/æ/g),"ae");
    r = r.replace(new RegExp(/ç/g),"c");
    r = r.replace(new RegExp(/[èéêë]/g),"e");
    r = r.replace(new RegExp(/[ìíîï]/g),"i");
    r = r.replace(new RegExp(/ñ/g),"n");                
    r = r.replace(new RegExp(/[òóôõö]/g),"o");
    r = r.replace(new RegExp(/œ/g),"oe");
    r = r.replace(new RegExp(/[ùúûü]/g),"u");
    r = r.replace(new RegExp(/[ýÿ]/g),"y");
    r = r.replace(new RegExp(/\W/g),"");
    return r;
};
Array.prototype.remove= function(){
    var what, a= arguments, L= a.length, ax;
    while(L && this.length){
        what= a[--L];
        while((ax= this.indexOf(what))!= -1){
            this.splice(ax, 1);
        }
    }
    return this;
}
if(!Array.prototype.indexOf){
    Array.prototype.indexOf= function(what, i){
        i= i || 0;
        var L= this.length;
        while(i< L){
            if(this[i]=== what) return i;
            ++i;
        }
        return -1;
    }
}
