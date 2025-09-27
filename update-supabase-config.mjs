import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = 'https://pmqcegwfucfbwwmwumkk.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no encontrada en las variables de entorno')
  console.log('💡 Necesitas obtener la Service Role Key de tu panel de Supabase')
  console.log('   Ve a: Settings → API → service_role key')
  console.log('')
  console.log('📋 INSTRUCCIONES MANUALES:')
  console.log('')
  console.log('1. Ve a tu panel de Supabase: https://supabase.com/dashboard')
  console.log('2. Selecciona tu proyecto: pmqcegwfucfbwwmwumkk')
  console.log('3. Ve a Authentication → URL Configuration')
  console.log('4. En "Redirect URLs" agrega estas URLs:')
  console.log('   - http://localhost/#/auth/callback')
  console.log('   - https://tudominio.com/#/auth/callback')
  console.log('')
  console.log('5. En "Site URL" cambia a:')
  console.log('   http://localhost')
  console.log('')
  console.log('6. Guarda los cambios')
  console.log('')
  console.log('✅ Una vez hecho esto, la autenticación de Google funcionará correctamente')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateAuthConfig() {
  try {
    console.log('🔄 Actualizando configuración de autenticación...')
    
    // Nota: La API de Supabase no permite actualizar la configuración de auth directamente
    // Necesitamos hacer esto manualmente en el panel de Supabase
    
    console.log('📋 INSTRUCCIONES MANUALES:')
    console.log('')
    console.log('1. Ve a tu panel de Supabase: https://supabase.com/dashboard')
    console.log('2. Selecciona tu proyecto: pmqcegwfucfbwwmwumkk')
    console.log('3. Ve a Authentication → URL Configuration')
    console.log('4. En "Redirect URLs" agrega estas URLs:')
    console.log('   - http://localhost/#/auth/callback')
    console.log('   - https://tudominio.com/#/auth/callback')
    console.log('')
    console.log('5. En "Site URL" cambia a:')
    console.log('   http://localhost')
    console.log('')
    console.log('6. Guarda los cambios')
    console.log('')
    console.log('✅ Una vez hecho esto, la autenticación de Google funcionará correctamente')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

updateAuthConfig()
