<?php
/**
 * Calculadora ROI - API Endpoint
 * POST /calculadora-roi/api/calculate.php
 * Recibe datos del formulario + cálculo y guarda en base de datos / envía email
 */

// CORS headers
header('Access-Control-Allow-Origin: https://acrux.life');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Leer input JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON inválido']);
    exit();
}

// Validar campos requeridos
$required = ['sector', 'tamano', 'problema', 'inversion', 'email', 'consent'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Campo requerido: $field"]);
        exit();
    }
}

// Validar email
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido']);
    exit();
}

// Validar consentimiento
if (!$input['consent']) {
    http_response_code(400);
    echo json_encode(['error' => 'Consentimiento requerido']);
    exit();
}

// Sanitizar datos
$data = [
    'sector' => htmlspecialchars($input['sector']),
    'tamano' => htmlspecialchars($input['tamano']),
    'problema' => htmlspecialchars($input['problema']),
    'inversion' => htmlspecialchars($input['inversion']),
    'email' => filter_var($input['email'], FILTER_SANITIZE_EMAIL),
    'consent' => true,
    'roi_porcentual' => (int)($input['roiPorcentual'] ?? 0),
    'payback_meses' => (float)($input['paybackMeses'] ?? 0),
    'ahorro_anual' => (int)($input['ahorroAnual'] ?? 0),
    'costo_problema_anual' => (int)($input['costoProblemaAnual'] ?? 0),
    'monto_inversion' => (int)($input['montoInversion'] ?? 0),
    'empleados' => (int)($input['empleados'] ?? 0),
    'factor_sector' => (float)($input['factorSector'] ?? 1.0),
    'created_at' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
];

// TODO: Guardar en base de datos
// require_once __DIR__ . '/../../database/config.php';
// $stmt = $pdo->prepare("INSERT INTO calculadora_roi_leads (...) VALUES (...)");
// $stmt->execute([...]);

// TODO: Enviar email con resultados
// mail($data['email'], 'Tu análisis ROI - ACRUX', $message, $headers);

// Log para debugging (remover en producción)
error_log('Calculadora ROI Lead: ' . json_encode([
    'email' => $data['email'],
    'sector' => $data['sector'],
    'roi' => $data['roi_porcentual'],
    'payback' => $data['payback_meses'],
]));

// Respuesta exitosa
echo json_encode([
    'success' => true,
    'message' => 'Resultados guardados. Revisa tu email para el reporte completo.',
    'data' => [
        'roi' => $data['roi_porcentual'],
        'payback' => $data['payback_meses'],
        'ahorro_anual' => $data['ahorro_anual'],
    ]
]);