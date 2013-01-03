/*

@author: Mauricio Rocha
plugin: vtex_xml_menu

purpose:    Build a menu with a xml file
             
use:
    jQuery("#container").vtex_xml_menu({
        url:"/menus/categoria"
    });
    
options:
    url: "/menus/categoria" // required

    
*/
(function( $ ) {
    $.fn.vtex_xml_menu = function(options){
    
        var container=null;
    
        var _settings = $.extend({
            url:null,
            sets:null,
            callback:null
        }, options);
        
        
        var _xml_menu = {
            xml:null,
            columns:[],
            sections:[],
            sets:null,
            init: function(e)
            {
                if(_xml_menu.check(e))
                    _xml_menu.run();
            },
            run: function()
            {
                _xml_menu.load.xml();
            },
            load:
            {
                xml: function()
                {
                    jQuery.ajax({
                        url: document.location.protocol+"//"+document.location.host+_settings.url,
                        success: function(data)
                        {
                            var result = data.match(/<dados([\S\s]*?)(.+)dados>/g);
                            
                            if(result!=null)
                            {
                                var result_ampersand_free = result[0].replace(/&(?!amp;)/g,"&amp;");
                                _xml_menu.xml = _xml_menu.convert.StringtoXML(result_ampersand_free);
                                // _xml_menu.xml = _xml_menu.convert.StringtoXML(result);
                                _xml_menu.place.menu();
                            }
                        },
                        error: function()
                        {
                            _xml_menu.log("O endereço do menu não foi encontrado.\nVerifique o seu arquivo de configuração.");
                        }
                    });
                }
            },
            get:
            {
                columns: function()
                {
                    var column;
                    _xml_menu.columns=[];
                    jQuery(_xml_menu.xml).find("new_column:contains('sim')").siblings("menu").each(function(ndx,item)
                    {
                        column = jQuery(item).text();
                        if(!_xml_menu.columns.inArray(column))
                            _xml_menu.columns.push(column);
                    });
                    
                    _xml_menu.sets = _xml_menu.columns.length;
                    
                    if(_xml_menu.columns.length>0) return true;
                    else return false;
                }
            },
            set:
            {
                sections: function()
                {
                    var section;
                    _xml_menu.sections=[];
                    jQuery(_xml_menu.xml).find("section:contains('sim')").siblings("menu").each(function(ndx,item)
                    {
                        section = jQuery(item).text();
                        if(!_xml_menu.sections.inArray(section))
                            _xml_menu.sections.push(section);
                    });
                },
                containers: function()
                {
                    var container_div;
                    jQuery(_xml_menu.columns).each(function(ndx,item){
                        container_div = jQuery('<div/>').addClass('menu-xml-container').addClass('menu-xml-container-'+ndx);
                        jQuery(container).append(container_div);
                    });
                },
                sets: function(e)
                {
                    if(_settings.sets==null) return;
                    if(_settings.sets==0||_settings.sets=="max"||_settings.sets=="all") _settings.sets=_xml_menu.columns.length;
                    
                    // var elems = jQuery('.menu-xml-container');
                    var elems = jQuery(e).find('>div');
                    var arr = [];
                    classname = 'menu-xml-wrapper';
                    set_counter=0;
                    elems.each(function(ndx,item) {
                        arr.push(item);
                        if (((ndx + 1) % _settings.sets === 0) || (ndx === elems.length -1))
                        {
                            var set = jQuery(arr);
                            arr = [];
                            div_container = jQuery("<div/>").addClass(classname).addClass(classname+"-"+set_counter);
                            set.wrapAll(div_container);
                            set_counter++;
                        }
                    });
                }
            },
            place:
            {
                menu: function()
                {
                    if(!_xml_menu.get.columns()) return false;
                    
                    _xml_menu.mount.menus();
                }                    
            },
            mount:
            {
                menus: function()
                {
                    _xml_menu.set.sections();
                    _xml_menu.set.containers();
                    _xml_menu.mount.menu.items();
                    // _xml_menu.set.sets();
                    
                    if(typeof _settings.callback=="function")
                        _settings.callback();
                },
                menu:
                {
                    items: function()
                    {
                        var counter=-1;
                        var item_ndx=0;
                        var menu_container,dl,dt,dd,text;
                        var sets_done=[];
                        jQuery(_xml_menu.xml).find("menu").each(function(ndx,item)
                        {
                            url=jQuery(item).siblings("url").text()||"javascript:void(0)";
                            menu=jQuery(item).text();
                            icon=jQuery(item).siblings("icon").text()||"";
                            target=jQuery(item).siblings("target")||"_self";
                            if(icon!="")
                            {
                                img = jQuery('<img/>').attr('src',icon);
                                span_img = jQuery('<span/>').addClass('_img');
                                span = jQuery('<span/>').html(menu);
                                jQuery(span_img).append(img);
                                a = jQuery('<a/>').attr('href',url).attr('target',target).append(span_img).append(span);
                            }
                            else
                                a = jQuery('<a/>').attr('href',url).attr('target',target).html(menu);

                            if(jQuery(item).siblings("new_column").text()=="sim"||ndx==0)
                            {
                                counter++;
                                item_ndx=0;
                                menu_container=".menu-xml-container-"+counter;
                                dl=jQuery('<dl/>');
                            }
                            
                            if(jQuery(item).siblings("section").text()=="sim")
                            {
                                jQuery(container).find(menu_container).addClass("in");
                                item_container = jQuery('<dt/>').addClass('menu-xml-item').addClass('menu-xml-item-'+item_ndx);
                            }
                            else
                            {
                                item_container = jQuery('<dd/>').addClass('menu-xml-item').addClass('menu-xml-item-'+item_ndx);
                            }
                            item_ndx++;
                            
                            special_class = jQuery(item).siblings("special_class").text()||"";
                            if(special_class!="")
                            {
                                jQuery(item_container).addClass(special_class);
                                jQuery('.menu-xml-container-'+counter).addClass(special_class);
                            }
                            
                            jQuery(item_container).append(a);
                            jQuery(dl).append(item_container);
                            jQuery(container).find(menu_container).append(dl);
                        });
                        _xml_menu.set.sets(jQuery(menu_container).parent());
                        
                    }
                }
            },
            check: function(e)
            {
                var result = false;
                
                if(jQuery(e).length<=0) // This checks if the container is set. Otherwise, nothing will happen.
                {
                    _xml_menu.log("A container is required to build the menu.");
                    result = false;
                    return result;
                }
                
                if( _settings.url!=null ) // This checks if the url is set. Otherwise, nothing will happen.
                {
                    container = e;
                    result = true;
                } else {
                    _xml_menu.log("A URL is required to load menu.");
                }
                
                return result;
            },
            log: function(log)
            {
                if(typeof console=="undefined") return;
                
                console.log(log);
            },
            convert:
            {
                StringtoXML: function(text)
                {
                    if (window.ActiveXObject)
                    {
                        var doc=new ActiveXObject('Microsoft.XMLDOM');
                        doc.async='false';
                        doc.loadXML(text);
                    } else {
                        var parser=new DOMParser();
                        var doc=parser.parseFromString(text,'text/xml');
                    }
                    return doc;
                }
            }
        }
        
        return _xml_menu.init(this);
    }
})( jQuery );

Array.prototype.inArray = function(value)
{
    // Returns true if the passed value is found in the array. Returns false if it is not.
    var i;
    for (i=0; i < this.length; i++)
        if (this[i] == value)
            return true;
    return false;
};
