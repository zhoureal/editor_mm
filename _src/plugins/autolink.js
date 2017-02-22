///import core
///commands 为非ie浏览器自动添加a标签
///commandsName  AutoLink
///commandsTitle  自动增加链接
/**
 * @description 为非ie浏览器自动添加a标签
 * @author zhanyi
 */

UE.plugin.register('autolink', function() {
    var cont = 0;
    // var rxWebURL = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/i;
    // var rxWebURL = new RegExp(
    //     // Word boundaries
    //     "^" +
    // // protocol identifier
    // "(?:(?:https?|ftp|file)://)?" +
    // // user:pass authentication
    // "(?:\\S+(?::\\S*)?@)?" +
    // "(?:" +
    //   // IP address exclusion
    //   // private & local networks
    //   "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
    //   "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
    //   "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
    //   // IP address dotted notation octets
    //   // excludes loopback network 0.0.0.0
    //   // excludes reserved space >= 224.0.0.0
    //   // excludes network & broacast addresses
    //   // (first & last IP address of each class)
    //   "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    //   "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    //   "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    // "|" +
    //   // host name
    //   "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
    //   // domain name
    //   "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
    //   // TLD identifier
    //   "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    //   // TLD may end with dot
    //   "\\.?" +
    // ")" +
    // // port number
    // "(?::\\d{2,5})?" +
    // // resource path
    // "(?:[/?#]\\S*)?" +
    // "$", "i"
    // );
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
        + "[a-z]{2,6})" // first level domain- .com or .museum 
        + "(:[0-9]{1,4})?" // 端口- :80 
        + "((/?)|" // a slash isn't required if there is no file name 
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var rxWebURL = new RegExp(strRegex,"i");
    var chineseCode = /[^\u0000-\u00FF]/;
    // var mailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/;
    return !browser.ie ? {

        bindEvents: {
            'reset': function() {
                cont = 0;
            },
            'keydown': function(type, evt) {
                var me = this;
                var keyCode = evt.keyCode || evt.which;
                var mailTag = false;

                if (keyCode == 32 || keyCode == 13) {

                    var sel = me.selection.getNative(),
                        range = sel.getRangeAt(0).cloneRange(),
                        offset,
                        charCode;

                    var start = range.startContainer;
                    while (start.nodeType == 1 && range.startOffset > 0) {
                        start = range.startContainer.childNodes[range.startOffset - 1];
                        if (!start) {
                            break;
                        }
                        range.setStart(start, start.nodeType == 1 ? start.childNodes.length : start.nodeValue.length);
                        range.collapse(true);
                        start = range.startContainer;
                    }

                    do {
                        if (range.startOffset == 0) {
                            start = range.startContainer.previousSibling;

                            while (start && start.nodeType == 1) {
                                start = start.lastChild;
                            }
                            if (!start || domUtils.isFillChar(start)) {
                                break;
                            }
                            offset = start.nodeValue.length;
                        } else {
                            start = range.startContainer;
                            offset = range.startOffset;
                        }
                        range.setStart(start, offset - 1);
                        charCode = range.toString().charCodeAt(0);
                    } while (charCode != 160 && charCode != 32);
                    var i=0;
                    if (range.toString().replace(new RegExp(domUtils.fillChar, 'g'), '').match(/(?:https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|@|www\.)/i)) {
                        while (range.toString().length) {
                            if (mailReg.test(range.toString()) && (!chineseCode.test(range.toString()))) {
                                // console.log(mailTag);
                                mailTag = true;
                                break;
                            }
                            console.log(new Date().getTime())
                            if (/^(?:https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.)/i.test(range.toString()) && rxWebURL.test(range.toString()) && (!chineseCode.test(range.toString()))) {
                                break;
                            }
                            console.log(new Date().getTime())
                            try {
                                range.setStart(range.startContainer, range.startOffset + 1);
                            } catch (e) {
                                //trace:2121
                                var start = range.startContainer;
                                while (!(next = start.nextSibling)) {
                                    if (domUtils.isBody(start)) {
                                        return;
                                    }
                                    start = start.parentNode;

                                }
                                range.setStart(next, 0);

                            }

                        }
                        //range的开始边界已经在a标签里的不再处理
                        if (domUtils.findParentByTagName(range.startContainer, 'a', true)) {
                            return;
                        }
                        var a = me.document.createElement('a'),
                            text = me.document.createTextNode(' '),
                            href;

                        me.undoManger && me.undoManger.save();
                        a.appendChild(range.extractContents());
                        a.href = a.innerHTML = a.innerHTML.replace(/<[^>]+>/g, '');
                        href = a.getAttribute("href").replace(new RegExp(domUtils.fillChar, 'g'), '');
                        if (mailTag) {
                            href = "mailto:" + href;
                        } else {
                            href = /^(?:https?:\/\/)/ig.test(href) ? href : "http://" + href;
                            a.setAttribute('_src', utils.html(href));
                        }
                        a.href = utils.html(href);

                        var doc = document.getElementById("ueditor_0");
                        if (doc) {
                            doc.contentWindow.document.execCommand("insertHTML", false, a.outerHTML);
                        }
                        // range.insertNode(a);
                        // a.parentNode.insertBefore(text, a.nextSibling);
                        // range.setStart(text, 0);
                        // range.collapse(true);
                        // sel.removeAllRanges();
                        // sel.addRange(range);
                        // me.undoManger && me.undoManger.save();
                    }
                }
            }
        }
    } : {}
}, function() {
    var keyCodes = {
        37: 1,
        38: 1,
        39: 1,
        40: 1,
        13: 1,
        32: 1
    };

    function checkIsCludeLink(node) {
        if (node.nodeType == 3) {
            return null
        }
        if (node.nodeName == 'A') {
            return node;
        }
        var lastChild = node.lastChild;

        while (lastChild) {
            if (lastChild.nodeName == 'A') {
                return lastChild;
            }
            if (lastChild.nodeType == 3) {
                if (domUtils.isWhitespace(lastChild)) {
                    lastChild = lastChild.previousSibling;
                    continue;
                }
                return null
            }
            lastChild = lastChild.lastChild;
        }
    }
    browser.ie && this.addListener('keyup', function(cmd, evt) {
        var me = this,
            keyCode = evt.keyCode;
        if (keyCodes[keyCode]) {
            var rng = me.selection.getRange();
            var start = rng.startContainer;

            if (keyCode == 13) {
                while (start && !domUtils.isBody(start) && !domUtils.isBlockElm(start)) {
                    start = start.parentNode;
                }
                if (start && !domUtils.isBody(start) && start.nodeName == 'P') {
                    var pre = start.previousSibling;
                    if (pre && pre.nodeType == 1) {
                        var pre = checkIsCludeLink(pre);
                        if (pre && !pre.getAttribute('_href')) {
                            domUtils.remove(pre, true);
                        }
                    }
                }
            } else if (keyCode == 32) {
                if (start.nodeType == 3 && /^\s$/.test(start.nodeValue)) {
                    start = start.previousSibling;
                    if (start && start.nodeName == 'A' && !start.getAttribute('_href')) {
                        domUtils.remove(start, true);
                    }
                }
            } else {
                start = domUtils.findParentByTagName(start, 'a', true);
                if (start && !start.getAttribute('_href')) {
                    var bk = rng.createBookmark();

                    domUtils.remove(start, true);
                    rng.moveToBookmark(bk).select(true)
                }
            }

        }


    });
});
