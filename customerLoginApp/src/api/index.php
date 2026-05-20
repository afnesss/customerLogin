<?php
$base_url = 'https://sandbox.crmcarecloud.com';
$project_url = '/webservice/rest-api/customer-interface/v1.0'; 

$path = $_SERVER['REQUEST_URI'];
$path = str_replace('/api', $project_url, $path);
$full_url = $base_url . $path;

$method = $_SERVER['REQUEST_METHOD']; 
$body = json_decode(file_get_contents('php://input'), true);
if (strpos($path, '/tokens') !== false) {
    $body['external_application_id'] = '85d6598db0bf3f62afd5db8507';
}
$body_json = json_encode($body);
$headers = getallheaders();
$auth = $headers['Authorization']
    ?? $_SERVER['HTTP_AUTHORIZATION']
    ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
    ?? '';

$ch = curl_init($full_url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body_json);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: ' . $auth
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
http_response_code($http_code);
echo $response;