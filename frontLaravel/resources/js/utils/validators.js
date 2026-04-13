/**
 * validators.js
 * Reglas de validación centralizadas para todos los formularios del sistema.
 */

/**
 * Valida que un valor sea un número de punto flotante positivo.
 * Permite enteros y decimales (ej: "10", "10.5", "0.99").
 * @param {string|number} value
 * @returns {boolean}
 */
export const isValidFloat = (value) => {
    if (value === '' || value === null || value === undefined) return false;
    const num = Number.parseFloat(value);
    return !Number.isNaN(num) && Number.isFinite(num) && num >= 0 && /^\d+(\.\d+)?$/.test(String(value).trim());
};

/**
 * Valida que una cadena tenga formato de correo electrónico válido.
 * Requiere: contener "@", no tener espacios, y tener al menos un "." después del "@".
 * @param {string} value
 * @returns {boolean}
 */
export const isValidEmail = (value) => {
    if (!value || typeof value !== 'string') return false;
    const trimmed = value.trim();
    // Sin espacios, con @, y con dominio con punto
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};

/**
 * Valida número de teléfono internacional.
 * Formatos aceptados:
 *   +591 74047460        (Bolivia)
 *   +58 416-1571491      (Venezuela)
 *   +1 (703) 282-1084    (USA/Canadá)
 * Regla general: signo +, código de país (1-3 dígitos), espacio,
 * y luego dígitos con posibles espacios, guiones o paréntesis.
 * @param {string} value
 * @returns {boolean}
 */
export const isValidPhone = (value) => {
    if (!value || typeof value !== 'string') return false;
    const trimmed = value.trim();
    // +[1-3 dígitos] espacio [dígitos, guiones, paréntesis, espacios]
    return /^\+\d{1,3}\s[\d\s\-()[\]]{6,20}$/.test(trimmed);
};

/**
 * Devuelve el mensaje de error para un campo de precio.
 * @param {string|number} value
 * @returns {string|null} null si es válido
 */
export const validatePrice = (value) => {
    if (value === '' || value === null || value === undefined) return 'Este campo es obligatorio.';
    if (!isValidFloat(value)) return 'Ingresa un número decimal válido (ej: 10.50).';
    return null;
};

/**
 * Devuelve el mensaje de error para un campo de correo electrónico.
 * @param {string} value
 * @param {boolean} required
 * @returns {string|null} null si es válido
 */
export const validateEmail = (value, required = true) => {
    if (!value || value.trim() === '') {
        return required ? 'El correo electrónico es obligatorio.' : null;
    }
    if (value.includes(' ')) return 'El correo no puede contener espacios.';
    if (!isValidEmail(value)) return 'Ingresa un correo válido (ej: usuario@dominio.com).';
    return null;
};

/**
 * Devuelve el mensaje de error para un campo de teléfono.
 * @param {string} value
 * @param {boolean} required
 * @returns {string|null} null si es válido
 */
export const validatePhone = (value, required = true) => {
    if (!value || value.trim() === '') {
        return required ? 'El número de teléfono es obligatorio.' : null;
    }
    if (!isValidPhone(value)) {
        return 'Formato inválido. Usa: +591 74047460, +58 416-1571491 o +1 (703) 282-1084';
    }
    return null;
};
