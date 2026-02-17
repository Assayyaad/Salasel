/** @import { Cells, Rows } from './csv.js' */

const fs = require('fs-extra')
const { logAction } = require('./cmd.js')
const { tableToRows, rowToCells, rowsToTable, cellsToRow } = require('./csv.js')

/**
 * @param {Readonly<string>} filePath
 * @param {(strObj: Record<string, string>) => Record<string, any>} objectifyFn
 * @returns {Promise<Record<string, any>[]>}
 */
async function readFileRecords(filePath, objectifyFn) {
  const { headers, rows } = await readFileRows(filePath)
  if (headers.length === 0) {
    return []
  }

  /** @type {Record<string, any>[]} */
  const records = []
  /** @type {Record<string, string>} */
  const strObj = {}

  for (let i = 0; i < rows.length; i++) {
    const cells = rowToCells(rows[i])
    headers.forEach((h, i) => (strObj[h] = cells[i]))
    records.push(objectifyFn(strObj))
  }

  return records
}

/**
 * Reads and parses a CSV file into rows
 * @param {string} filePath - Full path to the CSV file
 * @returns {Promise<{headers: Cells, rows: Rows}>}
 */
async function readFileRows(filePath) {
  const table = await fs.readFile(filePath, 'utf8')
  const rows = tableToRows(table)

  if (rows.length === 0) {
    return { headers: [], rows: [] }
  }

  return {
    headers: rowToCells(rows[0]),
    rows: rows.slice(1),
  }
}

/**
 * @param {Readonly<string>} filePath
 * @param {Readonly<Cells>} headers
 * @param {Readonly<Record<string, string>[]>} records
 */
async function writeFileRecords(filePath, headers, records) {
  /** @type {Rows} */
  const rows = []

  // Add header row
  rows.push(cellsToRow(headers))

  // Add data rows
  records.forEach((r) => {
    const cells = headers.map((h) => r[h])
    const row = cellsToRow(cells)
    rows.push(row)
  })

  await writeFileRows(filePath, rows)
}

/**
 * Writes rows back to a CSV file
 * @param {string} filePath - Full path to the CSV file
 * @param {Readonly<Rows>} rows - Array of CSV rows (including header)
 * @returns {Promise<void>}
 */
async function writeFileRows(filePath, rows) {
  const table = rowsToTable(rows)
  await fs.writeFile(filePath, table, 'utf8')
}

/**
 * Processes all CSV files in a directory with a given operation
 * @param {string} dirPath - Directory containing CSV files
 * @param {(file: string) => Promise<void>} processFn - Async function to process each file
 * @param {string} operationName - Name of the operation for logging
 * @returns {Promise<void>}
 */
async function processAllFiles(dirPath, processFn, operationName) {
  logAction(`${operationName}...`)

  const csvFiles = /** @type {string[]} */ (await fs.readdir(dirPath)).filter((f) => f.endsWith('.csv'))
  console.log(`Found ${csvFiles.length} video CSV files`)

  /** @type {Promise<void>[]} */
  const promises = []
  for (const file of csvFiles) {
    promises.push(processFn(file))
  }
  await Promise.all(promises)
}

module.exports = {
  readFileRecords,
  readFileRows,

  writeFileRecords,
  writeFileRows,

  processAllFiles,
}
