<?php
/**
 * Health Check Endpoint
 * GET /calculadora-roi/api/health.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'status' => 'healthy',
    'service' => 'calculadora-roi-api',
    'version' => '0.0.1',
    'timestamp' => date('c'),
    'php_version' => PHP_VERSION,
]);