export const MaskDocument = (e: string): string => {
  let value = e.replace(/\D/g, "")

  if (value.length <= 11) {
    // CPF: 999.999.999-99
    value = value
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
  } else {
    // CNPJ: 99.999.999/9999-99
    value = value
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
  }

  return value
}