/**
 Sample application for embedding node-web-kit inside the SignagePlayer
 @app app.js
 @license MIT
 **/
define(['Consts', 'backbone.controller', 'ComBroker', 'Lib', 'Elements'], function (Consts, backbonecontroller, ComBroker, Lib, Elements) {
    /*
     To setup remote node web kit debug be sure to config correct ip address in:
     A) NodeWebkitBridge client.connect(port, '192.168.81.135', function() ....
     B) In SignagePlayer Desktop PC c:\Program Files (x86)/SignagePlayer/config.xml
     C) In Intellij set Node-Web-Kit arguments of: 1234 8555
     */
    var App = Backbone.Controller.extend({

        initialize: function () {
            var self = this;
            BB.globs['UNIQUE_COUNTER'] = 0;
            BB.Elements = Elements;
            BB.lib = new Lib();
            BB.lib.addBackboneViewOptions();
            BB.comBroker = new ComBroker();
            BB.comBroker.name = 'AppBroker';
            window.log = BB.lib.log;
            self.m_loaderInterval = null;

            if (mode == 'node') {
                self.m_gui = require('nw.gui');
                self.m_win = self.m_gui.Window.get();
                // var new_win = self.m_gui.Window.open('https://github.com');
                var path = require('path');
                // we know we are running in node, but are we running on Player side or remote debug?
                BB.SIGNAGEPLAYER_MODE = path.dirname(process.execPath).indexOf('SignagePlayer') > -1 ? true : false;
            } else {
                BB.SIGNAGEPLAYER_MODE = null;
            }

            self._listenPlayerError();
            self._listenDispose();
            self._waitPlayerData();

        },

        /**
         Load pages
         @method _loadPages
         @params {Object} i_jData
         **/
        _loadPages: function (i_jData) {
            var self = this;

            var $iFrame = $('#if');
            $iFrame.css({
                minWidth: window.outerWidth,
                minHeight: window.outerHeight
            });

            var refresh = $.isNumeric(i_jData._refresh) ? i_jData._refresh : 60;
            refresh = refresh * 60000;
            var urls = i_jData._urls.split(',');

            function goToURL(i_url) {
                $iFrame.attr('src', i_url);
            }

            function getNextLink() {
                var url = urls.shift();
                if (url == undefined)
                    urls = i_jData._urls.split(',');
                if (url == undefined)
                    return;
                goToURL(url);
            }

            getNextLink();
            self.m_loaderInterval = setInterval(getNextLink, refresh);

            /* intercept clicks on links and modify */
            //$iFrame.on("load", function () {
            //    var iframeContents = $(this).contents();
            //    iframeContents.find("a").click(function (e) {
            //        e.preventDefault();
            //        var link = $(this).attr("href");
            //        goToURL('http://www.digitalsignage.com/' + link);
            //    });
            //});
        },

        /**
         Listen to when player xml data is available
         @method _waitPlayerData
         **/
        _waitPlayerData: function () {
            var self = this;
            var fd = setInterval(function () {
                if (window.xmlData) {
                    var x2js = new X2JS();
                    var jData = x2js.xml_str2json(window.xmlData);
                    window.clearInterval(fd);
                    self._loadPages(jData.Data);
                    // var new_win = self.m_gui.Window.open('https://github.com');
                    //self.m_SamplePlayerView.dataLoaded(jData.Data);
                    //self.m_stackView.selectView(self.m_SamplePlayerView);
                }
            }, 1000);
        },

        /**
         Listen for errors on parsing player data
         @method _listenPlayerError
         **/
        _listenPlayerError: function () {
            var self = this;
            log('123')
            BB.comBroker.listen(BB.EVENTS.ON_XMLDATA_ERROR, function (e) {
                if (debug)
                    log('err parsing xdata: ' + e.edata);
            });
        },

        /**
         Listen application / component removed from timeline
         @method _listenDispose
         **/
        _listenDispose: function () {
            var self = this;
            clearInterval(self.m_loaderInterval);
            BB.comBroker.listen(BB.EVENTS.ON_DISPOSE, function (e) {
                BB.comBroker.stopListen(BB.EVENTS.ON_XMLDATA_ERROR);
                BB.comBroker.stopListen(BB.EVENTS.ON_DISPOSE);
            });
        }
    });

    return new App();

});
