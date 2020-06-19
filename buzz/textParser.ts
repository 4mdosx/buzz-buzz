export interface textCMD {
  command: string | null
  args: string[]
  raw: string
}


export const textParser = function (text: string): textCMD {
  const arr = text.split(' ')
  return {
    command: arr[0][0] === '/' ? arr[0].slice(1) : null,
    args: arr.slice(1),
    raw: text
  }
}