<?php
/**
 * Middleware de Validação de Dados
 */

/**
 * Validar CPF
 */
function validateCPF($cpf) {
    // Remove non-digits
    $cpf = preg_replace('/[^0-9]/', '', $cpf);
    
    if (strlen($cpf) != 11) {
        return false;
    }
    
    // Check for known invalid CPFs
    if (str_repeat($cpf[0], 11) === $cpf) {
        return false;
    }
    
    // Validate first digit
    $sum = 0;
    for ($i = 0; $i < 9; $i++) {
        $sum += (int)$cpf[$i] * (10 - $i);
    }
    $digit1 = ($sum * 10) % 11;
    if ($digit1 == 10) $digit1 = 0;
    
    if ($digit1 != (int)$cpf[9]) {
        return false;
    }
    
    // Validate second digit
    $sum = 0;
    for ($i = 0; $i < 10; $i++) {
        $sum += (int)$cpf[$i] * (11 - $i);
    }
    $digit2 = ($sum * 10) % 11;
    if ($digit2 == 10) $digit2 = 0;
    
    if ($digit2 != (int)$cpf[10]) {
        return false;
    }
    
    return true;
}

/**
 * Validar CNPJ
 */
function validateCNPJ($cnpj) {
    // Remove non-digits
    $cnpj = preg_replace('/[^0-9]/', '', $cnpj);
    
    if (strlen($cnpj) != 14) {
        return false;
    }
    
    // Check for known invalid CNPJs
    if (str_repeat($cnpj[0], 14) === $cnpj) {
        return false;
    }
    
    // Validate first digit
    $sum = 0;
    $multipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for ($i = 0; $i < 12; $i++) {
        $sum += (int)$cnpj[$i] * $multipliers[$i];
    }
    $digit1 = $sum % 11;
    $digit1 = ($digit1 < 2) ? 0 : 11 - $digit1;
    
    if ($digit1 != (int)$cnpj[12]) {
        return false;
    }
    
    // Validate second digit
    $sum = 0;
    $multipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for ($i = 0; $i < 13; $i++) {
        $sum += (int)$cnpj[$i] * $multipliers[$i];
    }
    $digit2 = $sum % 11;
    $digit2 = ($digit2 < 2) ? 0 : 11 - $digit2;
    
    if ($digit2 != (int)$cnpj[13]) {
        return false;
    }
    
    return true;
}

/**
 * Validar email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validar URL
 */
function validateUrl($url) {
    return filter_var($url, FILTER_VALIDATE_URL) !== false;
}

/**
 * Validar data no formato Y-m-d
 */
function validateDate($date) {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}

/**
 * Validar telefone brasileiro
 */
function validatePhone($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    return strlen($phone) >= 10 && strlen($phone) <= 11;
}

/**
 * Validar campos obrigatórios
 */
function validateRequiredFields($data, $fields) {
    $errors = [];
    
    foreach ($fields as $field) {
        if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
            $errors[] = "O campo '$field' é obrigatório";
        }
    }
    
    return $errors;
}

/**
 * Validar comprimento de string
 */
function validateLength($value, $min = null, $max = null) {
    $length = strlen($value);
    
    if ($min !== null && $length < $min) {
        return "Mínimo de $min caracteres";
    }
    
    if ($max !== null && $length > $max) {
        return "Máximo de $max caracteres";
    }
    
    return true;
}

/**
 * Validar número
 */
function validateNumber($value, $min = null, $max = null) {
    if (!is_numeric($value)) {
        return "Valor deve ser numérico";
    }
    
    $num = (float)$value;
    
    if ($min !== null && $num < $min) {
        return "Valor mínimo: $min";
    }
    
    if ($max !== null && $num > $max) {
        return "Valor máximo: $max";
    }
    
    return true;
}

/**
 * Validar array
 */
function validateArray($value, $minItems = null, $maxItems = null) {
    if (!is_array($value)) {
        return "Valor deve ser um array";
    }
    
    $count = count($value);
    
    if ($minItems !== null && $count < $minItems) {
        return "Mínimo de $minItems itens";
    }
    
    if ($maxItems !== null && $count > $maxItems) {
        return "Máximo de $maxItems itens";
    }
    
    return true;
}

/**
 * Sanitizar string
 */
function sanitizeString($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

/**
 * Sanitizar array
 */
function sanitizeArray($array) {
    return array_map('sanitizeString', $array);
}

