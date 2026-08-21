// auth.js - Supabase Authentication Layer (FIXED v2)
// All login/logout functions with proper exports

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env.js';

console.log('🔑 Auth module loading...', { URL: SUPABASE_URL ? '✓' : '✗', KEY: SUPABASE_ANON_KEY ? '✓' : '✗' });

// Initialize Supabase client
let supabase = null;

try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Missing Supabase credentials in env.js');
    }
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized');
} catch (error) {
    console.error('❌ Failed to initialize Supabase:', error.message);
}

// ===== AUTHENTICATION FUNCTIONS =====

/**
 * Sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - User data if successful
 */
export async function signIn(email, password) {
    try {
        if (!supabase) {
            throw new Error('Supabase client not initialized. Check env.js credentials.');
        }

        console.log('🔐 Attempting login for:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            console.error('❌ Sign in error:', error.message);
            throw new Error(error.message);
        }
        
        console.log('✅ Sign in successful:', data.user.email);
        return data;
    } catch (err) {
        console.error('❌ Sign in failed:', err.message);
        throw err;
    }
}

/**
 * Sign out (log out)
 * @returns {Promise} - Result of sign out
 */
export async function signOut() {
    try {
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }

        console.log('🚪 Signing out...');
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('❌ Sign out error:', error.message);
            throw new Error(error.message);
        }
        
        console.log('✅ Signed out successfully');
        return true;
    } catch (err) {
        console.error('❌ Sign out failed:', err);
        throw err;
    }
}

/**
 * Get currently logged-in user
 * FIX: Check for session first before calling getUser() to avoid 403 errors
 * @returns {Promise} - User object or null
 */
export async function getCurrentUser() {
    try {
        if (!supabase) {
            console.warn('⚠️ Supabase client not initialized');
            return null;
        }

        // Step 1: Check if there's an active session (no server call)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
            console.warn('⚠️ Session check error:', sessionError.message);
            return null;
        }
        
        // Step 2: Only call getUser() if session exists
        if (session) {
            console.log('✅ Active session found');
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError) {
                console.error('❌ Get user error:', userError.message);
                return null;
            }
            
            console.log('✅ User data retrieved:', user.email);
            return user;
        }
        
        // No session = not logged in
        console.log('ℹ️ No active session');
        return null;
    } catch (err) {
        console.error('❌ Get current user failed:', err);
        return null;
    }
}

/**
 * Check if user is authenticated
 * @returns {Promise} - true if logged in, false otherwise
 */
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

/**
 * Get user's ID (UUID)
 * @returns {Promise} - User ID or null
 */
export async function getUserId() {
    const user = await getCurrentUser();
    return user ? user.id : null;
}

/**
 * Get user's email
 * @returns {Promise} - User email or null
 */
export async function getUserEmail() {
    const user = await getCurrentUser();
    return user ? user.email : null;
}

/**
 * Listen to auth state changes
 * Useful for watching login/logout events
 * @param {Function} callback - Called when auth state changes
 * @returns {Function} - Unsubscribe function
 */
export function onAuthStateChange(callback) {
    if (!supabase) {
        console.error('Supabase not initialized');
        return () => {};
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
            console.log('🔔 Auth state changed:', event);
            callback(event, session);
        }
    );
    
    // Return unsubscribe function
    return () => subscription?.unsubscribe();
}

/**
 * Get Supabase client (for use in other files)
 * @returns {Object} - Supabase client instance
 */
export function getSupabaseClient() {
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }
    return supabase;
}

// Expose to window for debugging
window.authDebug = {
    getCurrentUser,
    signIn,
    signOut,
    isAuthenticated,
    checkSupabaseClient: () => supabase ? '✅ Initialized' : '❌ Not initialized'
};

console.log('✅ Auth module loaded successfully');