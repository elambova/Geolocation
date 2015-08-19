/* global google */

(function () {
    'use strict';
    $(document).ready(function () {
        var paragraph = $('#result p');
        var mapContainer = $('#map');
        var options = {};
        mapContainer.hide();
        
        function checkExistGeolocation() {
            if (!navigator.geolocation) {
                paragraph.addClass('error');
                paragraph.html('Geolocation is not support by your browser! Sorry!');
            }
            else {
                options = {
                    enableHighAccuracy: true,
                    maximumAge: 0
                };
            }
        }

        function createMap(latitude, longitude) {
            var map = new google.maps.Map(mapContainer[0], {
                center: new google.maps.LatLng(latitude, longitude),
                zoom: 20,
                mapTypeId: google.maps.MapTypeId.HYBRID
            });
            return map;
        }

        function createMarker(latitude, longitude) {
            var marker = new google.maps.Marker({
                map: createMap(latitude, longitude),
                position: new google.maps.LatLng(latitude, longitude),
                title: 'Hi , I am here',
                draggable: true,
                animation: google.maps.Animation.DROP
            });
            return marker;
        }

        function successLocation(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var googlePosition = new google.maps.LatLng(latitude, longitude);
            var geoCoder = new google.maps.Geocoder();

            mapContainer.show();

            paragraph.addClass('success');
            paragraph.html('Latitude: ' + latitude + ', ' + 'Longitude: ' + longitude);

            geoCoder.geocode({
                'latLng': googlePosition
            }, function (result, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (result[1]) {
                        var popUp = new google.maps.InfoWindow({
                            content: result[1].formatted_address,
                            position: googlePosition
                        });

                        $.ajax({
                            method: "POST",
                            url: 'js/data/location.php',
                            data: {
                                lat: latitude,
                                long: longitude,
                                address: result[1].address_components[0].long_name,
                                city: result[1].address_components[1].long_name
                            },
                            dataType: 'html'
                        })
                                .done(function (data) {
                                    console.log(data);
                                })
                                .fail(function (jqXHR, status, error) {
                                    console.log(status, error);
                                })
                                .always(function () {
                                    console.log('Complete!');
                                });
                        google.maps.event.addListener(createMarker(latitude, longitude), 'click', function () {
                            popUp.open(createMap(latitude, longitude));
                        });
                    } else {
                        alert('No results found');
                    }
                } else {
                    alert('Geocoder failed due to: ' + status);
                }
            });
        }
        function errorLocation(error) {
            paragraph.addClass('error');
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    paragraph.html("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    paragraph.html("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    paragraph.html("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    paragraph.html("An unknown error occurred.");
                    break;
            }
        }

        $('#button-position').click(function () {
            checkExistGeolocation();
            navigator.geolocation.getCurrentPosition(successLocation, errorLocation, options);
            $('#button-position, #header').fadeOut();
        }
        );
    });
}());