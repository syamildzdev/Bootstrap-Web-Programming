function WebSocketInit()
         {
            if ("WebSocket" in window)
            {               
               // Let us open a web socket
               var ws = new WebSocket('ws://35.190.157.9:8881');
				
               ws.onopen = function()
               {
                  // Web Socket is connected, send data using send()
                  ws.send("Message to send");
                  alert("Message is sent...");
               };
				
               ws.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;
                  var wsData = received_msg.split(';');
                  var gpsImei = wsData[0];
                  var gpsLat = wsData[1];
                  var gpsLng = wsData[2];
               };
				
               ws.onclose = function()
               { 
                  // websocket is closed.
                  alert("Connection is closed..."); 
               };
					
               window.onbeforeunload = function(event) {
                  socket.close();
               };
            }
            
            else
            {
               // The browser doesn't support WebSocket
               alert("WebSocket NOT supported by your Browser!");
            }
         }