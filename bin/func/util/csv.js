const fs = require('fs-extra')

/**
 * @param {Readonly<string>} filePath
 * @param {(row: any) => any} objectifyFn
 * @returns {Promise<any[]>}
 */
async function readCsvFile(filePath, objectifyFn) {
  const content = await fs.readFile(filePath, 'utf8')
  const lines = content.split('\n').filter((l) => l.trim() !== '')
  if (lines.length === 0) {
    return []
  }

  const headers = lines[0].split(',').map((h) => h.trim())

  /** @type {any[]} */
  const records = []
  /** @type {{[key: string]: any}} */
  const row = {}

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim())
    headers.forEach((h, i) => (row[h] = values[i]))
    records.push(objectifyFn(row))
  }

  return records
}

/**
 * @param {Readonly<string>} filePath
 * @param {Readonly<string[]>} header
 * @param {Readonly<Record<string, string>[]>} records
 */
async function writeCsvFile(filePath, header, records) {
  /** @type {string[]} */
  const lines = []
  lines.push(header.join(','))
  records.forEach((r) => {
    // @ts-ignore
    const values = header.map((h) => r[h])
    lines.push(values.join(','))
  })
  const content = lines.join('\n')
  await fs.writeFile(filePath, content, 'utf8')
}

module.exports = {
  readCsvFile,
  writeCsvFile,
}
