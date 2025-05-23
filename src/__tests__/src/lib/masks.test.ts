import { MaskDocument } from "../../../lib/masks";

describe('MaskDocument', () => {
  it('deve formatar corretamente um CPF', () => {
    expect(MaskDocument('12345678901')).toBe('123.456.789-01')
  })

  it('deve formatar corretamente um CNPJ', () => {
    expect(MaskDocument('12345678000199')).toBe('12.345.678/0001-99')
  })

  it('deve remover caracteres não numéricos', () => {
    expect(MaskDocument('123.456.789-01')).toBe('123.456.789-01')
    expect(MaskDocument('12.345.678/0001-99')).toBe('12.345.678/0001-99')
  })

  it('deve lidar com strings vazias', () => {
    expect(MaskDocument('')).toBe('')
  })

  it('deve retornar parcialmente formatado se incompleto', () => {
    expect(MaskDocument('123')).toBe('123')
    expect(MaskDocument('1234567890')).toBe('123.456.789-0')
    expect(MaskDocument('123456780001')).toBe('12.345.678/0001')
  })
})