function WebSocketInit() {
    // Opening a websocket
    var ws = new WebSocket('ws://35.190.157.9:3000/echo');

    ws.onopen = function() {
        // Web Socket is connected, send data using send()
        ws.send("Message to send");
    };

    ws.onmessage = function (evt) { 
        var received_msg = evt.data;
        wsData = JSON.parse(received_msg);
        gpsImei = parseFloat(wsData.dev_IMEI);
        gpsLat = parseFloat(wsData.veh_lat_coordinate);    
        gpsLng = parseFloat(wsData.veh_long_coordinate);
        transition(gpsLat, gpsLng); // move marker to current vehicle's position      
    };

    ws.onclose = function() { 
        // websocket is closed.
        alert("Connection is closed..."); 
    };

    window.onbeforeunload = function(event) {
        socket.close();
    };
}