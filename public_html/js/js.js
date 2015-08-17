(function () {
    'use strict';
    $(document).ready(function () {
        var paragraph = $('#result p');
        var mapContainer = $('#map');
        var options = {};
        mapContainer.hide();
        function checkGeolocation() {
            if (!navigator.geolocation) {
                paragraph.addClass('error');
                paragraph.html('Geolocation is not support by your browser! Sorry!');
            }
            else {
                options = {
                    enableHighAccuracy: true,
                    timeout: Infinity,
                    maximumAge: 0
                };
            }
        }

        function successLocation(position) {
            mapContainer.show();
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            paragraph.addClass('success');
            paragraph.html('Latitude: ' + latitude + ', ' + 'Longitude: ' + longitude);

            var googlePosition = new google.maps.LatLng(latitude, longitude);

            var map = new google.maps.Map(mapContainer[0], {
                center: googlePosition,
                zoom: 20,
                mapTypeId: google.maps.MapTypeId.HYBRID
            });

            var marker = new google.maps.Marker({
                map: map,
                position: googlePosition,
                title: 'Hi , I am here',
                draggable: true,
                animation: google.maps.Animation.DROP
            });

            var geoCoder = new google.maps.Geocoder();
            geoCoder.geocode({
                'latLng': googlePosition
            }, function (result, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (result[1]) {
                        var popUp = new google.maps.InfoWindow({
                            content: result[1].formatted_address,
                            position: googlePosition
                        });
                        google.maps.event.addListener(marker, 'click', function () {
                            popUp.open(map);
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
            checkGeolocation();
            navigator.geolocation.getCurrentPosition(successLocation, errorLocation, options);
            $('#button-position, #header').fadeOut();
        }
        );
    });
}());