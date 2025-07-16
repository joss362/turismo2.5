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
            html += `
                <div class="comment">
                    <div class="comment-header">
                        <span class="comment-author">${comment.name}</span>
                        <span class="comment-date">${new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <div class="comment-text">${comment.comment}</div>
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
    
    // Obtener valores del formulario
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const comment = form.comment.value.trim();
    
    // Validación simple
    if (!name || !email || !comment) {
        showMessage(messageEl, 'Por favor completa todos los campos', 'error');
        return;
    }
    
    // Deshabilitar botón para evitar múltiples envíos
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    try {
        // Insertar comentario en Supabase
        const { data, error } = await supabase
            .from('comments')
            .insert([
                { name, email, comment, approved: false } // Inicialmente no aprobado
            ]);
        
        if (error) throw error;
        
        // Mostrar mensaje de éxito
        showMessage(messageEl, '¡Gracias por tu comentario! Será revisado antes de publicarse.', 'success');
        
        // Limpiar formulario
        form.reset();
        
        // Opcional: recargar comentarios después de un tiempo
        setTimeout(loadComments, 3000);
    } catch (error) {
        console.error('Error submitting comment:', error);
        showMessage(messageEl, 'Error al enviar el comentario. Por favor, inténtalo de nuevo.', 'error');
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Comentario';
    }
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