/**
 MediaSignage Inc Digital Signage open source component
 This file serves as the HTML properties view for the Sample SignagePlayer component
 **/


var x2js = new X2JS();
var m_data = {};
var m_hRsources = {};
var hResource = 0;
var skipSave = 0;

/**
 SAVE: get settings from UI and save to local msdb
 @method getData
 @return {XML} json to xml data
 **/
function getData() {
    m_data = {Data: {}};

    // get background color
    m_data.Data._bgColor = document.getElementById('bgColor').value;

    try {
        m_data.Data._url = $('#remoteUrl').val();

        // saved dragged images
        if (_.size(m_hRsources) != 0) {
            var n = 0;
            m_data.Data.Resource = {};
            for (var i in m_hRsources) {
                n++;
                var name = buildResourceName(n);
                m_data.Data.Resource[name] = m_hRsources[i];
            }
        }
    } catch (e) {
        log('err 2 ' + e);
    }

    // alert(JSON.stringify(m_data));
    // return data as xml
    return x2js.json2xml_str(m_data);
}

/**
 LOAD: populate the UI with from local msdb onto UI
 we also must re-apply all data to m_data.Data so it gets
 saved bacl to the local msdb via getData()
 @method setData
 @param {XML} i_xmlData
 **/
function setData(i_xmlData) {
    if (skipSave)
        return;

    try {

        m_data = x2js.xml_str2json(i_xmlData);

        if (m_data.Data._url != null) {
            $('#remoteUrl').val(m_data.Data._url)
            $('#img4').attr('src', m_data.Data._url);
        }

        if (m_data.Data.Resource != null) {
            var res = m_data.Data.Resource;
            var n = 0;
            for (var i in res) {
                var m_hRsource = res[i];
                getObjectValue(0, 'getResourcePath(' + m_hRsource + ')', function (b) {
                    var el = $('#draggedImages').children().get(n);
                    $(el).attr('src', JSON.parse(b));
                    m_hRsources[i] = m_hRsource;

                });
                n++;
            }
        }
        // set background color
        if (m_data.Data._bgColor != null) {
            $('#bgColor').val(m_data.Data._bgColor);
        }
    } catch (e) {
        log('err 1 ' + e);
    }
}


/**
 DOM Ready
 @method onReady
 **/
$(document).ready(function () {
    var self = this;
    $('.number').stepper({min: 0, max: 9999});
    $('#tab-container').easytabs();
});

