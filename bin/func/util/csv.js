const fs = require('fs-extra')

/**
 * @typedef {string} Table
 */

/**
 * @typedef {Row[]} Rows
 */

/**
 * @typedef {string} Row
 */

/**
 * @typedef {Cell[]} Cells
 */

/**
 * @typedef {string} Cell
 */

/**
 * @typedef {Record<'id'|string, [number, string]>} RowChecks
 */

const tableSep = '\n'
const rowSep = ','

/**
 * @param {Readonly<Table>} table
 * @returns {Row[]}
 */
function tableToRows(table) {
  return oneToMany(table, tableSep, true)
}

/**
 * @param {Readonly<Row>} row
 * @returns {Cell[]}
 */
function rowToCells(row) {
  return oneToMany(row, rowSep, false)
}

/**
 * @param {Readonly<string>} one
 * @param {Readonly<string>} sep
 * @param {Readonly<boolean>} filterEmpty
 * @returns {string[]}
 */
function oneToMany(one, sep, filterEmpty = false) {
  return one
    .split(sep)
    .map((part) => part.trim())
    .filter((part) => !filterEmpty || part !== '')
}

/**
 * @param {Readonly<Row[]>} rows
 * @returns {Table}
 */
function rowsToTable(rows) {
  return manyToOne(rows, tableSep, true)
}

/**
 * @param {Readonly<Cell[]>} cells
 * @returns {Row}
 */
function cellsToRow(cells) {
  return manyToOne(cells, rowSep, false)
}

/**
 * @param {Readonly<string[]>} many
 * @param {Readonly<string>} sep
 * @param {Readonly<boolean>} filterEmpty
 * @returns {string}
 */
function manyToOne(many, sep, filterEmpty = false) {
  return many
    .map((one) => one.trim())
    .filter((one) => !filterEmpty || one !== '')
    .join(sep)
}

/**
 * Validates that a CSV file has required columns
 * @param {string} file - File name (for logging)
 * @param {string[]} headers - Array of header names
 * @param {string[]} required - Array of required column names
 * @returns {boolean}
 */
function validateHeaders(file, headers, required) {
  const missing = required.filter((c) => !headers.includes(c))

  if (missing.length > 0) {
    console.log(`⚠ Skipping ${file} (missing columns: ${missing.join(', ')})`)
    return false
  }

  return true
}

/**
 * @param {Readonly<Cells>} headers
 * @param {Readonly<Rows>} rows
 * @param {Readonly<Record<string, string>>} columnChecks
 * @return {Rows}
 */
function validateRows(headers, rows, columnChecks) {
  /** @type {RowChecks} */
  const checks = {}
  for (const key in columnChecks) {
    if (!columnChecks.hasOwnProperty(key)) continue

    const index = headers.indexOf(key)
    if (index !== -1) {
      checks[key] = [index, columnChecks[key]]
    }
  }

  // Process data rows
  /** @type {Rows} */
  const newRows = []
  for (let i = 0; i < rows.length; i++) {
    /** @type {Row} */
    const row = rows[i]
    /** @type {Cells} */
    const cells = rowToCells(row)
    /** @type {Cells} */
    const newCells = validateCells(cells, checks)

    if (newCells.length > 0) {
      newRows.push(cellsToRow(newCells))
    }
  }

  // Build final content with sorted rows
  return [cellsToRow(headers), ...newRows]
}

/**
 * @param {Readonly<Cell[]>} cells
 * @param {Readonly<RowChecks>} checks
 * @return {Cells}
 */
function validateCells(cells, checks) {
  // Skip rows with empty id
  if (isCellEmpty(cells, checks.id[0])) {
    return []
  }

  /** @type {Cells} */
  const newCells = []
  // Fill empty cells with default values based on checks
  for (const key in checks) {
    if (!checks.hasOwnProperty(key)) continue

    const [index, defaultValue] = checks[key]

    // If index is valid and cell is empty, fill it with default value
    newCells[index] = isCellEmpty(cells, index) ? defaultValue : cells[index]
  }

  return newCells
}

/**
 * @param {Readonly<string[]>} cells
 * @param {Readonly<number>} index
 * @returns {boolean}
 */
function isCellEmpty(cells, index) {
  return index !== -1 && (!cells[index] || cells[index] === '')
}

module.exports = {
  tableToRows,
  rowsToTable,
  rowToCells,
  cellsToRow,

  validateHeaders,
  validateRows,
  validateCells,
}
