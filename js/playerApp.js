/**
 Sample application for embedding node-web-kit inside the SignagePlayer
 @app app.js
 @license MIT
 **/
define(['Consts', 'bootstrap', 'backbone.controller', 'ComBroker', 'Lib', 'Elements', 'SamplePlayerView', 'LoadingView', 'StackView', 'simplestorage'], function (Consts, bootstrap, backbonecontroller, ComBroker, Lib, Elements, SamplePlayerView, LoadingView, StackView, simplestorage) {
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

            $.ajaxSetup({cache: false});
            $.ajaxSetup({headers: {'Authorization': ''}});

            return;

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
         Listen to when player xml data is available
         @method _waitPlayerData
         **/
        _waitPlayerData: function () {
            var self = this;
            var fd = setInterval(function () {
                if (window.xmlData) {
                    var x2js = new X2JS();
                    var jData = x2js.xml_str2json(window.xmlData);
                    self._setStyle(jData.Data);
                    window.clearInterval(fd);
                    var new_win = self.m_gui.Window.open('https://github.com');
                    //self.m_SamplePlayerView.dataLoaded(jData.Data);
                    //self.m_stackView.selectView(self.m_SamplePlayerView);
                }
            }, 1000);
        },

        /**
         Set the background color and styling of component
         @method _setStyle
         @param {string} i_style
         **/
        _setStyle: function (i_style) {
            var self = this;
            $('.bgColor').css({'backgroundColor': i_style._bgColor})
        },

        /**
         Listen for errors on parsing player data
         @method _listenPlayerError
         **/
        _listenPlayerError: function () {
            var self = this;
            BB.comBroker.listen(BB.EVENTS.ON_XMLDATA_ERROR, function (e) {
                if (window.debug)
                    alert('err parsing xdata: ' + e.edata);
            });
        },

        /**
         Listen application / component removed from timeline
         @method _listenDispose
         **/
        _listenDispose: function () {
            var self = this;
            BB.comBroker.listen(BB.EVENTS.ON_DISPOSE, function (e) {
                BB.comBroker.stopListen(BB.EVENTS.ON_XMLDATA_ERROR);
                BB.comBroker.stopListen(BB.EVENTS.ON_DISPOSE);
            });
        }
    });

    return new App();

});
