// Configura Supabase
const supabaseUrl = 'https://lsdfweaaxznhnvfvnavi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZGZ3ZWFheHpuaG52ZnZuYXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTc4NTQsImV4cCI6MjA2ODE5Mzg1NH0.PC6FOZvNSgsfFxZzrd311YW9IjMy3UauNByikWMqmrU'; // Usa la clave pública
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Cargar comentarios cuando la página se cargue
document.addEventListener('DOMContentLoaded', () => {
    loadComments();
    
    // Configurar el formulario
    const commentForm = document.getElementById('comment-form');
    commentForm.addEventListener('submit', handleSubmit);
});

// Función para sanitizar el input (elimina etiquetas HTML/JS)
function sanitizeInput(input) {
    if (!input) return '';
    return input.replace(/<[^>]*>?/gm, '');
}

// Función para detectar si el texto contiene código
function containsCode(text) {
    if (!text) return false;
    
    // Patrones comunes en código
    const codePatterns = [
        /function\s*\(/,
        /=>/,
        /<\w+>/,
        /<\/\w+>/,
        /{\s*[\w:]+\s*}/,
        /\[.*\]/,
        /console\.log/,
        /(var|let|const)\s+\w+\s*=/,
        /(if|for|while)\s*\(.*\)/,
        /<\/?script>/i,
        /(eval|alert)\(/,
        /\\x[0-9a-fA-F]{2}/,  // Caracteres escapados
        /&#x?[0-9a-fA-F]+;/  // Entidades HTML
    ];
    
    return codePatterns.some(pattern => pattern.test(text));
}

// Función para validar formato de correo
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función auxiliar para mostrar mensajes
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = 'message ' + type;
    setTimeout(() => {
        element.textContent = '';
        element.className = 'message';
    }, 5000);
}

// Función para cargar comentarios desde Supabase
async function loadComments() {
    const commentsList = document.getElementById('comments-list');
    
    try {
        // Obtener solo comentarios aprobados, ordenados por fecha descendente
        const { data: comments, error } = await supabase
            .from('comments')
            .select('*')
            .eq('approved', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p>No hay comentarios aún. ¡Sé el primero en comentar!</p>';
            return;
        }
        
        // Generar HTML para los comentarios
        let html = '';
        comments.forEach(comment => {
            // Asegurarse de escapar el contenido antes de mostrarlo
            const safeComment = sanitizeInput(comment.comment);
            const safeName = sanitizeInput(comment.name);
            
            html += `
                <div class="comment">
                    <div class="comment-header">
                        <span class="comment-author">${safeName}</span>
                        <span class="comment-date">${new Date(comment.created_at).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                    </div>
                    <div class="comment-text">${safeComment}</div>
                </div>
            `;
        });
        
        commentsList.innerHTML = html;
    } catch (error) {
        commentsList.innerHTML = '<p>Error al cargar los comentarios. Por favor, recarga la página.</p>';
        console.error('Error loading comments:', error);
    }
}

// Manejar el envío del formulario
async function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const messageEl = document.getElementById('form-message');
    
    // Obtener y sanitizar valores del formulario
    const name = sanitizeInput(form.name.value.trim());
    const email = sanitizeInput(form.email.value.trim());
    const comment = sanitizeInput(form.comment.value.trim());
    
    // Validación básica
    if (!name || !email || !comment) {
        showMessage(messageEl, 'Por favor completa todos los campos', 'error');
        return;
    }
    
    // Validación de longitud máxima
    if (name.length > 50) {
        showMessage(messageEl, 'El nombre no puede exceder los 50 caracteres', 'error');
        return;
    }
    
    if (comment.length > 1000) {
        showMessage(messageEl, 'El comentario no puede exceder los 1000 caracteres', 'error');
        return;
    }
    
    // Validación de correo
    if (!isValidEmail(email)) {
        showMessage(messageEl, 'Por favor ingresa un correo electrónico válido', 'error');
        return;
    }
    
    // Validación contra código o contenido sospechoso
    if (containsCode(comment) || containsCode(name) || containsCode(email)) {
        showMessage(messageEl, 'El contenido no puede incluir código o sintaxis de programación', 'error');
        return;
    }
    
    // Deshabilitar botón para evitar múltiples envíos
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    try {
        // Insertar comentario en Supabase
        const { data, error } = await supabase
            .from('comments')
            .insert([{ 
                name, 
                email, 
                comment, 
                approved: false, // Requiere aprobación manual
                created_at: new Date().toISOString() 
            }]);
        
        if (error) throw error;
        
        // Mostrar mensaje de éxito
        showMessage(messageEl, '¡Gracias por tu comentario! Será revisado antes de publicarse.', 'success');
        
        // Limpiar formulario
        form.reset();
        
        // Recargar comentarios después de un tiempo
        setTimeout(loadComments, 3000);
    } catch (error) {
        console.error('Error submitting comment:', error);
        showMessage(messageEl, 'Error al enviar el comentario. Por favor, intenta con un contenido diferente.', 'error');
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Comentario';
    }
}