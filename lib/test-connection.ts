import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('polls')
      .select('count(*)')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    }
    
    console.log('Database connection successful:', data)
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Connection test failed:', error)
    return {
      success: false,
      error: 'Failed to connect to database',
      details: error
    }
  }
}

export async function checkTablesExist() {
  try {
    console.log('Checking if tables exist...')
    
    const tables = ['polls', 'options', 'votes']
    const results = {}
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count(*)')
          .limit(1)
        
        results[table] = {
          exists: !error,
          error: error?.message
        }
      } catch (err) {
        results[table] = {
          exists: false,
          error: err.message
        }
      }
    }
    
    console.log('Table check results:', results)
    return results
  } catch (error) {
    console.error('Table check failed:', error)
    return null
  }
}