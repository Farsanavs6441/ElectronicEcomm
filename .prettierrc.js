module.exports = {
  // Basic formatting
  printWidth: 80, // Line length that prettier will wrap on
  tabWidth: 2, // Number of spaces per indentation level
  useTabs: false, // Indent lines with spaces instead of tabs
  semi: true, // Add semicolons at the end of statements
  singleQuote: true, // Use single quotes instead of double quotes
  quoteProps: 'as-needed', // Only add quotes around object properties where required

  // JSX specific
  jsxSingleQuote: true, // Use single quotes in JSX

  // Trailing commas
  trailingComma: 'all', // Add trailing commas wherever possible

  // Brackets and spacing
  bracketSpacing: true, // Print spaces between brackets in object literals
  bracketSameLine: false, // Put the > of a multi-line JSX element at the end of the last line
  arrowParens: 'avoid', // Omit parens when possible in arrow functions

  // Range and file handling
  rangeStart: 0, // Format from the beginning of the file
  rangeEnd: Infinity, // Format to the end of the file
  requirePragma: false, // Don't require a special comment to format
  insertPragma: false, // Don't insert a special comment at the top of the file
  proseWrap: 'preserve', // Don't wrap prose

  // HTML specific (for any HTML files)
  htmlWhitespaceSensitivity: 'css',

  // End of line
  endOfLine: 'lf', // Use Line Feed only (\n), common on Linux and macOS
};
