var map = L.map('map');
var trailCoords = [];
var count = 0;
var showTrail = false;
var geofences = [];
var geofences_layers = [];

//var marker = L.marker([]);
var marker;
var polygon;
var line = L.polyline([]);

$.ajax({
	type: 'GET',
	url: '/test',
	dataType: 'json',
	success: function (json) {

		map.setView(json.coordinate, 18);
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18
		}).addTo(map);

		for (var i = 0; i < json.geofences.length; i++) {
			//drawPolygons(json.geofences[i][1],json.geofences[i][2]);
			geofences.push([json.geofences[i][1], json.geofences[i][2]]);
		}

		for (var i = 0; i < geofences.length; i++) {
			// geofences_layers[i]['layer'] = drawPolygons(geofences[i][0],geofences[i][1]);
			// geofences_layers[i]['name'] = geofences[i][1];
			geofences_layers.push({
				name: geofences[i][1],
				layer: drawPolygons(geofences[i][0], geofences[i][1]),
				id: i
			});

		}

		var select = document.getElementById("rec_mode");
		for (index in geofences_layers) {
			console.log(geofences_layers[index]);
			for (var i in geofences_layers[index]) {
				console.log(i); //key
				console.log(geofences_layers[index][i]); //value
				//
			}
			select.options[select.options.length] = new Option(geofences_layers[index]['name'], geofences_layers[index]['id']);
		}

		console.log(geofences);
		marker = L.marker(json.coordinate, {
				autoPan: true,
				riseOnHover: true
			});
		marker.bindTooltip(json.imei + ': ' + json.speed + 'KMH', {
			permanent: true
		}).openTooltip();
		marker.addTo(map);
	}
});

$(function () {
	setInterval(function () {
		$.ajax({
			type: 'GET',
			url: '/test',
			dataType: 'json',
			success: function (json) {
				$('#clock').html(json.datetime);
				updateMap(json.coordinate, json.imei, json.speed);

			}
		});
	}, 2000);
});
function showGeofence(elem) {
	console.log(elem.selectedIndex);
	map.addLayer(geofences_layers[elem.selectedIndex]['layer']);
}

function drawTrail(points) {

	if (points != null) {
		line = L.polyline(points);
	}

	switch (showTrail) {
	case true:
		map.addLayer(line);
		break;
	case false:
		map.removeLayer(line);
		break;
	default:
		//do nothing
	}

}

function drawPolygons(latlngs, name) {

	//      var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);

	if (latlngs != null) {

		var json_data = jQuery.parseJSON(latlngs);
		polygon = L.geoJson(json_data);
		var popup_content = `<div class="btn-group-horizontal btn-group-sm" role="group" id="geofence_popup">
            <button type="button" class="btn btn-xs geofence_popup_edit">Edit</button>
            <button type="button" class="btn btn-xs geofence_popup_hide">Hide</button>
            <button type="button" class="btn btn-danger btn-xs geofence_popup_delete">Delete</button></div>`;
		var tooltip_content = `<span class="badge badge-pill badge-warning">` + name + `</span>`;

		//Show popup when clicking on marker
		polygon.bindTooltip(tooltip_content, {
			permanent: true
		});
		polygon.bindPopup(popup_content, {
			closeOnClick: true,
			closeButton: false,
			className: "custom"

		});
		return polygon;
	}
}

function updateMap(coord, imei, speed) {
	// map.setView(coord, 18);
	count++;
	trailCoords.push(coord);
	trailCoords.splice(0, Math.max(0, trailCoords.length - 5));

	drawTrail(trailCoords);

	//Handle marker click
	var onMarkerClick = function (e) {
		console.log(this);
		//alert("You clicked on marker with customId: " +this.options.myCustomId);
	}

	console.log('next');
	console.log(coord);
	marker.setLatLng(coord);

	var popup_content = `<div class="card" style="width: 25rem;">
                                <img class="card-img-top" src="http://www.autolab.com.my/image/cache/catalog/car-models/perodua-myvi-200x200.png" alt="Card image cap">
                                <div class="card-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Vehicle:</th>
                                                <th>WXY 4914</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Position:</td>
                                                <td>3.010101,101.789678</td>
                                            </tr>
                                            <tr>
                                                <td>Angle:</td>
                                                <td>134&#176;</td>
                                            </tr>
                                            <tr>
                                                <td>Speed:</td>
                                                <td>87 km/h</td>
                                            </tr>
                                            <tr>
                                                <td>Time:</td>
                                                <td>15/02/2018 03:34:40</td>
                                            </tr>
                                            <tr>
                                                <td>Odometer:</td>
                                                <td>1293 km</td>
                                            </tr>
                                            <tr>
                                                <td>Engine hours:</td>
                                                <td>30 h 38 m</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>`;
	//var customPopup = '<table class="table"><thead><tr><th>Vehicle:</th><th>WXY 4914</th></tr></thead><tbody><tr><td>Position:</td><td>3.010101,101.789678</td></tr><tr><td>Angle:</td><td>134&#176;</td></tr><tr><td>Speed:</td><td>87 km/h</td></tr><tr><td>Time:</td><td>15/02/2018 03:34:40</td></tr><tr><td>Odometer:</td><td>1293 km</td></tr><tr><td>Engine hours:</td><td>30 h 38 m</td></tr></tbody></table>'
	var customPopup = popup_content;
	//Show popup when clicking on marker
	//marker.tooltipclose();
	marker.bindTooltip(imei + ': ' + speed + 'KMH');
	marker.bindPopup(customPopup, {
		closeOnClick: true,
		closeButton: false,
		className: "custom"

	});
	//Handle click on marker
	//marker.on('click', onMarkerClick);
}

// Draw controls


var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
		edit: {
			featureGroup: drawnItems,
			poly: {
				allowIntersection: false
			}
		},
		draw: {
			polygon: {
				allowIntersection: false,
				showArea: true,
				color: '#f357a1',
			},
			polyline: false,
			circle: false,
			rectangle: false,
			marker: false,
			circlemarker: false,
		},

	});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (event) {
	var coords_array = [];
	var shape_type = event.layerType;
	var which_layer = event.layer;
	var latLngs;

	if (shape_type === 'circle') {
		coords_array = which_layer.getLatLng(),
		layer.getRadius()
	} else {
		coords_array = which_layer.getLatLngs()[0].slice(0); // Returns an array of the points in the path.

		// process latLngs as you see fit and then save
	}
	var coords = which_layer.toGeoJSON().geometry.coordinates;

	var shape = which_layer.toGeoJSON()
		var shape_for_db = JSON.stringify(shape);
	$('#myModal').find('.polypoints').val(shape_for_db);
	$('#myModal').modal('show');
	console.log(coords);
	//drawnItems.addLayer(which_layer);
	drawPolygons(shape_for_db);
	//my @poly = map { [ (split /,/, $_)[0, 1] ] } split / /, $coords;
});

//    var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
//var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
// zoom the map to the polygon
//map.fitBounds(polygon.getBounds());
$(function () {
	$(".modal_close").click(function () {
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "/submito",
			//data: "data=" + $('#myModal').find('.polypoints').val(),
			data: {
				polypoints: $('#myModal').find('.polypoints').val(),
				geo_name: $('#myModal').find('.geo_name').val(),
				geo_alarm_type: $('input[name=geo_alarm_button]:checked', '#myModal').val(),
				geo_alarm_expires: $('#myModal').find('.geo_alarm_expires').val()

			},
			success: function (json) {
				$('#testo').html(json.testo);

			}
		});
	});
});

$(document).ready(function () {
	$('#deviceTable').DataTable({
		"pageLength": 5,
		"pagingType": "simple",
		"searching": false,
		"info": false,
		"lengthChange": false,
		"lengthMenu": [5, 10, 20],
		"ajax": "/test2",
		"columnDefs": [{
				targets: 1,
				searchable: false,
				orderable: false,
				render: function (data, type, full, meta) {
					if (type === 'display') {
						data = '<button type="button" id="show_geofence_' + full[0] + '" class="btn btn-xs btn-info GeoFenceToggleButton">Show GeoFence</button>';
					}

					return data;
				}
			}, {
				targets: 2,
				searchable: false,
				orderable: false,
				render: function (data, type, full, meta) {
					if (type === 'display') {
						data = '<button type="button" id="show_trail_' + full[0] + '" class="btn btn-xs btn-info TrailsToggleButton">Show Trails</button>';
					}

					return data;
				}
			}
		]
	});
	$("#example_wrapper").addClass('leaflet-control');
});

$("#deviceTable").on("click", ".TrailsToggleButton", function () {

	$(this).text(function (i, text) {
		return text === "Show Trails" ? "Hide Trails" : "Show Trails";
	})
	showTrail = true;
	$(this).text(function (i, text) {
		if (text === "Hide Trails") {

			map.removeLayer(line);
			return "Show Trails";
		} else {
			map.addLayer(line);
			return "Hide Trails";

		}

	})
});
$("#deviceTable").on("click", ".GeoFenceToggleButton", function () {

	$(this).text(function (i, text) {
		if (text === "Hide GeoFence") {

			map.removeLayer(geofences_layers[0]);
			map.removeLayer(geofences_layers[1]);
			return "Show GeoFence";
		} else {
			map.addLayer(geofences_layers[0]);
			map.addLayer(geofences_layers[1]);
			return "Hide GeoFence";

		}

	})

});

$("#geofence_popup").on("click", ".geofence_popup_edit", function () {

	console.log("edit");

});

$("#geofence_popup").on("click", ".geofence_popup_hide", function () {

	console.log("hide");

});

$("#geofence_popup").on("click", ".geofence_popup_delete", function () {

	console.log("delete");

});
