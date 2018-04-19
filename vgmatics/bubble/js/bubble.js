/**
* Creates a new marker and adds it to a group
* @param {H.map.Group} group       The group holding the new marker
* @param {H.geo.Point} coordinate  The location of the marker
* @param {String} html             Data associated with the marker
*/        
function addMarkerToGroup(group, coordinate, html) {
    var marker = new H.map.Marker(coordinate);
    // add custom data to the marker
    marker.setData(html);
    marker.addEventListener('tap', function() {
        map.setCenter(marker.getPosition());
        openInfoBox();
    });
    group.addObject(marker);
}

/**
 * Add two markers showing the position of Liverpool and Manchester City football clubs.
 * Clicking on a marker opens an infobubble which holds HTML content related to the marker.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addInfoBubble(map) {
    var group = new H.map.Group();

    map.addObject(group);

    // add 'tap' event listener, that opens info bubble, to the group
    group.addEventListener('tap', function (evt) {
    // event target is the marker itself, group is a parent event target
    // for all objects that it contains
        var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
            // read custom data
            content: evt.target.getData()
        });
        // show info bubble
        ui.addBubble(bubble);
    }, false);

    addMarkerToGroup(group, {lat:position[0], lng:position[1]},
        '<div style="background-color: aliceblue!important; color: #000";>' +
            '<div class="profile_picture" style="width=25%; float: left;">' +
                 '<img style="display: inline-block" src="resources/profile.png" height="42" width="42">' +
            '</div>' +
            '<div class="header" style="width=75%; float: left;">' +
                '<h3 style="text-align: center; margin: 10px">' + veh_info.veh_plate_no + '</h3>' +
            '</div>' +    
        '<table>' + 
            '<tr><th>No plate </th><td>: ' + veh_info.veh_plate_no + '</td></tr>' + 
            '<tr><th>Driver </th><td>: ' + veh_info.driver + '</td></tr>' +
            '<tr><th>Location </th><td>: ' + veh_info.location + '</td></tr>' +
            '<tr><th>Time </th><td>: ' + veh_info.time + '</td></tr>' +
            '<tr><th>Current speed </th><td>: ' + veh_info.current_speed + '</td></tr>' +
            '<tr><th>Average speed </th><td>: ' + veh_info.average_speed + '</td></tr>' +
            '<tr><th>Today top speed </th><td>: ' + veh_info.today_top_speed + '</td></tr>' +
            '<tr><th>Driving behavior </th><td>: ' + veh_info.driving_behavior + '</td></tr>' +
        '</table>' +
        '</div>');
}