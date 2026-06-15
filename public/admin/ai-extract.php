<?php
/**
 * EMMAGINATION AI Extract
 * Recibe una URL, obtiene el HTML y lo analiza con Claude para extraer datos del proyecto.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Deploy-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Verificar token (mismo que el webhook deploy para no crear otro secreto)
$secret = '__WEBHOOK_SECRET__';
$authHeader = $_SERVER['HTTP_X_DEPLOY_TOKEN'] ?? '';
if (!hash_equals($secret, $authHeader)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$url = trim($body['url'] ?? '');

if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'URL inválida']);
    exit;
}

$apiKey = '__ANTHROPIC_API_KEY__';
if (!$apiKey || str_contains($apiKey, '__')) {
    http_response_code(500);
    echo json_encode(['error' => 'API key no configurada']);
    exit;
}

// 1. Obtener HTML del sitio
$ctx = stream_context_create([
    'http' => [
        'timeout' => 15,
        'user_agent' => 'Mozilla/5.0 (compatible; Emmagination-Bot/1.0)',
        'follow_location' => true,
        'max_redirects' => 5,
    ],
    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
]);

$html = @file_get_contents($url, false, $ctx);
if ($html === false) {
    http_response_code(422);
    echo json_encode(['error' => 'No se pudo acceder al sitio. Verifica la URL.']);
    exit;
}

// Limpiar HTML: quitar scripts, estilos y reducir tamaño
$html = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $html);
$html = preg_replace('/<style\b[^>]*>.*?<\/style>/is', '', $html);
$html = preg_replace('/<!--.*?-->/s', '', $html);
$html = preg_replace('/\s+/', ' ', $html);
$html = strip_tags($html, '<title><h1><h2><h3><h4><p><a><meta><img><section><article><nav><header><footer><ul><li><div>');
$html = substr($html, 0, 12000); // máximo 12k chars para no exceder tokens

$domain = parse_url($url, PHP_URL_HOST);
$domain = preg_replace('/^www\./', '', $domain);
$slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', explode('.', $domain)[0]));
$year = date('Y');

// 2. Llamar a Claude
$prompt = <<<PROMPT
Analiza este sitio web y extrae información para una ficha de proyecto de agencia de diseño.

URL: {$url}
Dominio: {$domain}

HTML (resumido):
{$html}

Responde SOLO con un JSON válido con esta estructura exacta (sin markdown, sin explicaciones):
{
  "title": "Nombre del proyecto o empresa (claro y corto)",
  "client": "Nombre del cliente o empresa",
  "category": "Tipo de proyecto: E-commerce, Landing Page, Sitio Corporativo, Branding, etc.",
  "description": "Descripción del proyecto en 2-3 oraciones, enfocada en qué hace el sitio y para quién. En español.",
  "excerpt": "Frase corta de 1 oración para la grilla del portafolio. En español.",
  "services": ["Servicio 1", "Servicio 2"],
  "challenge": "Cuál era el desafío o necesidad del cliente. En español.",
  "solution": "Cómo se resolvió con diseño/desarrollo. En español.",
  "tags": "ETIQUETA1 · ETIQUETA2",
  "color": "#1a1a2e",
  "seoTitle": "Título SEO optimizado",
  "seoDescription": "Meta descripción SEO de 150 caracteres"
}

Reglas:
- Si no tienes información suficiente para un campo, usa una cadena vacía ""
- Los servicios típicos son: Diseño web, Branding, E-commerce, Shopify, WordPress, SEO, Landing Page
- El color debe ser un hex oscuro que pegue con la temática del sitio
- Todo el contenido en español
PROMPT;

$claudeBody = json_encode([
    'model' => 'claude-haiku-4-5-20251001',
    'max_tokens' => 1024,
    'messages' => [
        ['role' => 'user', 'content' => $prompt]
    ]
]);

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $claudeBody,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey,
        'anthropic-version: 2023-06-01',
    ],
]);

$claudeRaw = curl_exec($ch);
$curlErr = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al llamar a Claude: ' . $curlErr]);
    exit;
}

$claudeResp = json_decode($claudeRaw, true);
if (!isset($claudeResp['content'][0]['text'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Respuesta inválida de Claude', 'raw' => $claudeRaw]);
    exit;
}

$text = $claudeResp['content'][0]['text'];

// Extraer JSON de la respuesta
preg_match('/\{[\s\S]*\}/', $text, $matches);
if (!$matches) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo parsear la respuesta de Claude', 'raw' => $text]);
    exit;
}

$extracted = json_decode($matches[0], true);
if (!$extracted) {
    http_response_code(500);
    echo json_encode(['error' => 'JSON inválido de Claude', 'raw' => $text]);
    exit;
}

// 3. Armar el proyecto completo
$screenshotUrl = "https://image.thum.io/get/width/1200/crop/675/allowJPG/noanimate/wait/3/{$url}";

$project = [
    'id'                  => time() * 1000,
    'slug'                => $slug,
    'title'               => $extracted['title'] ?? $domain,
    'client'              => $extracted['client'] ?? $domain,
    'category'            => $extracted['category'] ?? 'Diseño web',
    'year'                => $year,
    'image'               => $screenshotUrl,
    'portfolioScrollImage'=> $screenshotUrl,
    'url'                 => $url,
    'description'         => $extracted['description'] ?? '',
    'excerpt'             => $extracted['excerpt'] ?? '',
    'services'            => $extracted['services'] ?? ['Diseño web'],
    'challenge'           => $extracted['challenge'] ?? '',
    'solution'            => $extracted['solution'] ?? '',
    'results'             => [],
    'gallery'             => [$screenshotUrl],
    'seoTitle'            => $extracted['seoTitle'] ?? '',
    'seoDescription'      => $extracted['seoDescription'] ?? '',
    'tags'                => $extracted['tags'] ?? '',
    'color'               => $extracted['color'] ?? '#1a1a2e',
    'metric'              => '',
    'metricLabel'         => '',
    'featured'            => false,
    'offset'              => 0,
];

echo json_encode(['ok' => true, 'project' => $project]);
