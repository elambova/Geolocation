<?php

include './connect.php';

$latitude = $_POST['lat'];
$longitude = $_POST['long'];
$address = $_POST['address'];
$city = $_POST['city'];

mysql_query("SET NAMES utf8");
$result = mysql_query('INSERT INTO location (latitude, longitude, address, city, date)'
        . ' VALUES (' . $latitude . ', ' . $longitude . ',"'
        . addslashes($address) . '", "' . addslashes($city)
        . '",' . time() . ')');

if (mysql_error()) {
    echo 'Can not safe data!';
} else {
    echo 'Location is saved!';
}