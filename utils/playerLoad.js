function playerLoad(i_xmlData) {
    try {
        window.xmlData = i_xmlData;
    }
    catch (e) {
        if (!BB) {
            BB.comBroker.fire(BB.EVENTS.ON_XMLDATA_ERROR,this,this,e);
        } else {
            alert(e)
        }
    }
}

function onPlayerEvent(item) {
    if (!BB)
        return;
    BB.comBroker.fire(BB.EVENTS.ON_PLAYER_EVENT, this, this, {
        name: item.eventName, param: item.eventParam
    });
}

function dispose() {
    // alert('dispose called');
    if (!BB)
        return;
    BB.comBroker.fire(BB.EVENTS.ON_DISPOSE);
}

/*
 function onCommand(item) {
 alert(item.eventName + ' ' + item.commandName + ' ' + item.commandParams);
 alert(JSON.stringify(item));
 };
 */