/**
 MediaSignage Inc Digital Signage open source component
 This file serves as the HTML properties view for the Sample SignagePlayer component
 **/
var x2js = new X2JS();
var m_data = {};
var hResource = 0;
var skipSave = 0;
var m_urls = [];
var m_refresh = 60;

/**
 SAVE: get settings from UI and save to local msdb
 @method getData
 @return {XML} json to xml data
 **/
function getData() {
    m_data = {Data: {}};
    try {
        if (!$.isNumeric(m_refresh))
            m_refresh = 60;
        m_data.Data._refresh = m_refresh;
        m_data.Data._urls = m_urls;
        // log('saving ' + m_data.Data._urls);
    } catch (e) {
        log('err 2 ' + e);
    }
    // log(JSON.stringify(m_data));
    return x2js.json2xml_str(m_data);
}

/**
 LOAD: populate the UI with from local msdb onto UI
 we also must re-apply all data to m_data.Data so it gets
 saved back to the local msdb via getData()
 @method setData
 @param {XML} i_xmlData
 **/
function setData(i_xmlData) {
    if (skipSave)
        return;

    try {
        m_data = x2js.xml_str2json(i_xmlData);

        if (m_data.Data._refresh != null){
            $('#refreshRate').val(m_data.Data._refresh);
        } else {
            $('#refreshRate').val(60);
        }

        if (m_data.Data._urls == null)
            return;
        var urls = m_data.Data._urls.split(',');
        $('#webPages').empty();
        for (var i = 0; i < urls.length; i++) {
            $('#webPages').append('<span><input class="pages" value="' + urls[i] + '"><i class="remove fa fa-times-circle "></i></span>');
        }
        listenRemovedUrl();
    } catch (e) {
        log('err 1 ' + e);
    }
}

/**
 Listen to adding of new URL address
 @method listenAddUrl
 **/
function listenAddUrl() {
    $('#add').on('click', function (e) {
        $('#webPages').append('<span><input class="pages"><i class="remove fa fa-times-circle "></i></span>');
        listenRemovedUrl();
        listenUpdateLinks();
    });
}

/**
 Listen to removal of URL address
 @method listenAddUrl
 **/
function listenRemovedUrl() {
    $('.remove').off().on('click', function (e) {
        $(this).closest('span').fadeOut('slow', function () {
        }).remove();

    });
}

/**
 Reconstruct the array / list of URL addresses
 @method listenAddUrl
 **/
function buildWebLinks() {
    m_urls = [];
    listenRemovedUrl();
    $('.pages').each(function (e) {
        m_urls.push($(this).val());
    });
}

/**
 Update the local msdb on changes to UI, use debounce for better performance
 @method listenUpdateLinks
 **/
function listenUpdateLinks($i_elem){
    var debouncer = function () {
        // $('#logs').text(Math.random());
        buildWebLinks();
        m_refresh = $('#refreshRate').val();
    };
    var delay = _.debounce(debouncer, 250, null);
    $i_elem.mousemove(delay);
    $i_elem.mouseleave(debouncer);
}

/**
 DOM Ready init functions
 @method onReady
 **/
$(document).ready(function () {
    $('.number').stepper({min: 0, max: 9999});
    var $tabContainer = $('#tab-container').easytabs();
    $tabContainer.easytabs();
    listenAddUrl();
    listenRemovedUrl();
    listenUpdateLinks($tabContainer);
});

