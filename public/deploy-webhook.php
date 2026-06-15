<?php
/**
 * EMMAGINATION Deploy Webhook
 * Recibe un ZIP desde GitHub Actions y lo extrae en public_html
 */

// Token secreto — debe coincidir con WEBHOOK_SECRET en GitHub
$secret = '__WEBHOOK_SECRET__';

// Verificar token
$authHeader = $_SERVER['HTTP_X_DEPLOY_TOKEN'] ?? '';
if (!hash_equals($secret, $authHeader)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Verificar que llegó un archivo
if (!isset($_FILES['zip']) || $_FILES['zip']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No ZIP file received']);
    exit;
}

$zipPath = $_FILES['zip']['tmp_name'];
$publicHtml = dirname(__DIR__); // un nivel arriba de este archivo = public_html

// Extraer ZIP
$zip = new ZipArchive();
if ($zip->open($zipPath) !== true) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to open ZIP']);
    exit;
}

// Extraer todos los archivos excepto este webhook
$extracted = 0;
for ($i = 0; $i < $zip->numFiles; $i++) {
    $name = $zip->getNameIndex($i);
    // No sobreescribir el webhook ni el .env
    if ($name === 'deploy-webhook.php' || str_starts_with($name, '.env')) {
        continue;
    }
    $zip->extractTo($publicHtml, $name);
    $extracted++;
}
$zip->close();

http_response_code(200);
echo json_encode([
    'ok' => true,
    'extracted' => $extracted,
    'timestamp' => date('c'),
]);
