import './__mocks__/supabase'
import { getAuthenticatedUserId } from '../lib/supabase'

jest.mock('../lib/backup/upload', () => ({ uploadBackup: jest.fn() }))
jest.mock('../lib/backup/restore', () => ({
  hasRemoteBackup: jest.fn(),
  downloadBackup: jest.fn(),
  restoreSnapshotToLocal: jest.fn(),
}))
jest.mock('../lib/backup/sync-manager', () => ({ setRestoring: jest.fn() }))

import { uploadBackup } from '../lib/backup/upload'
import { downloadBackup, hasRemoteBackup, restoreSnapshotToLocal } from '../lib/backup/restore'
import { setRestoring } from '../lib/backup/sync-manager'
import { backupNow, checkRemoteBackupExists, restoreFromCloud } from '../services/backup'

const mockGetAuthenticatedUserId = getAuthenticatedUserId as jest.Mock
const mockUploadBackup = uploadBackup as jest.Mock
const mockHasRemoteBackup = hasRemoteBackup as jest.Mock
const mockDownloadBackup = downloadBackup as jest.Mock
const mockRestoreSnapshotToLocal = restoreSnapshotToLocal as jest.Mock
const mockSetRestoring = setRestoring as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  mockGetAuthenticatedUserId.mockResolvedValue('user-123')
})

describe('backupNow', () => {
  it('obtém userId e faz upload do backup', async () => {
    mockUploadBackup.mockResolvedValue(undefined)
    await backupNow()
    expect(mockGetAuthenticatedUserId).toHaveBeenCalled()
    expect(mockUploadBackup).toHaveBeenCalledWith('user-123')
  })
})

describe('checkRemoteBackupExists', () => {
  it('retorna true quando backup remoto existe', async () => {
    mockHasRemoteBackup.mockResolvedValue(true)
    const result = await checkRemoteBackupExists()
    expect(mockHasRemoteBackup).toHaveBeenCalledWith('user-123')
    expect(result).toBe(true)
  })

  it('retorna false quando backup remoto não existe', async () => {
    mockHasRemoteBackup.mockResolvedValue(false)
    const result = await checkRemoteBackupExists()
    expect(result).toBe(false)
  })
})

describe('restoreFromCloud', () => {
  it('define restoring=true, restaura e define restoring=false ao final', async () => {
    const mockSnapshot = { version: 1, incomings: [], expenses: [], categories: [], profile: null }
    mockDownloadBackup.mockResolvedValue(mockSnapshot)
    mockRestoreSnapshotToLocal.mockReturnValue(undefined)
    await restoreFromCloud('user-123')
    expect(mockSetRestoring).toHaveBeenNthCalledWith(1, true)
    expect(mockDownloadBackup).toHaveBeenCalledWith('user-123')
    expect(mockRestoreSnapshotToLocal).toHaveBeenCalledWith(mockSnapshot)
    expect(mockSetRestoring).toHaveBeenNthCalledWith(2, false)
  })

  it('define restoring=false mesmo quando downloadBackup lança erro', async () => {
    mockDownloadBackup.mockRejectedValue(new Error('network error'))
    await expect(restoreFromCloud('user-123')).rejects.toThrow('network error')
    expect(mockSetRestoring).toHaveBeenNthCalledWith(1, true)
    expect(mockSetRestoring).toHaveBeenNthCalledWith(2, false)
  })
})
