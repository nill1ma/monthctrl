import './__mocks__/db-queries'
import { mockCategoriesQueries } from './__mocks__/db-queries'
import { getCategories } from '../services/categories'

beforeEach(() => { jest.clearAllMocks() })

describe('getCategories', () => {
  it('busca categorias do tipo expense', async () => {
    mockCategoriesQueries.getCategoriesByType.mockReturnValue([{ id: 'cat-1', name: 'Alimentação', type: 'expense' }])
    const result = await getCategories('expense')
    expect(mockCategoriesQueries.getCategoriesByType).toHaveBeenCalledWith('expense')
    expect(result).toEqual([{ id: 'cat-1', name: 'Alimentação', type: 'expense' }])
  })

  it('busca categorias do tipo incoming', async () => {
    mockCategoriesQueries.getCategoriesByType.mockReturnValue([{ id: 'cat-2', name: 'Salário', type: 'incoming' }])
    const result = await getCategories('incoming')
    expect(mockCategoriesQueries.getCategoriesByType).toHaveBeenCalledWith('incoming')
    expect(result).toEqual([{ id: 'cat-2', name: 'Salário', type: 'incoming' }])
  })

  it('retorna array vazio quando não há categorias', async () => {
    mockCategoriesQueries.getCategoriesByType.mockReturnValue([])
    const result = await getCategories('expense')
    expect(result).toEqual([])
  })
})
