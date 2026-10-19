import './__mocks__/supabase'
import { getAuthenticatedUserId } from '../lib/supabase'

jest.mock('../db/seeds/queries/profiles', () => ({
  getProfile: jest.fn(),
  upsertProfile: jest.fn(),
}))

import { getProfile, upsertProfile } from '../db/seeds/queries/profiles'
import { getMyProfile, updateMyProfile } from '../services/profiles'

const mockGetProfile = getProfile as jest.Mock
const mockUpsertProfile = upsertProfile as jest.Mock
const mockGetAuthenticatedUserId = getAuthenticatedUserId as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  mockGetAuthenticatedUserId.mockResolvedValue('user-123')
})

describe('getMyProfile', () => {
  it('busca o perfil do usuário autenticado', async () => {
    const mockProfile = { user_id: 'user-123', name: 'Nil', nickname: 'nil' }
    mockGetProfile.mockReturnValue(mockProfile)
    const result = await getMyProfile()
    expect(mockGetAuthenticatedUserId).toHaveBeenCalled()
    expect(mockGetProfile).toHaveBeenCalledWith('user-123')
    expect(result).toEqual(mockProfile)
  })

  it('retorna null quando perfil não existe', async () => {
    mockGetProfile.mockReturnValue(null)
    const result = await getMyProfile()
    expect(result).toBeNull()
  })
})

describe('updateMyProfile', () => {
  it('atualiza o perfil com userId do usuário autenticado', async () => {
    const input = { name: 'Nilton', preferred_currency: 'USD' }
    mockUpsertProfile.mockReturnValue({ user_id: 'user-123', ...input })
    const result = await updateMyProfile(input)
    expect(mockGetAuthenticatedUserId).toHaveBeenCalled()
    expect(mockUpsertProfile).toHaveBeenCalledWith('user-123', input)
    expect(result).toMatchObject({ user_id: 'user-123' })
  })
})
