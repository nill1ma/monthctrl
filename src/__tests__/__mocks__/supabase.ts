export const mockSupabaseAuth = {
  signInWithPassword: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  signInWithIdToken: jest.fn(),
  updateUser: jest.fn(),
  resetPasswordForEmail: jest.fn(),
  getUser: jest.fn(),
}
export const mockSupabase = { auth: mockSupabaseAuth }
jest.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
  getAuthenticatedUserId: jest.fn().mockResolvedValue('user-123'),
}))
