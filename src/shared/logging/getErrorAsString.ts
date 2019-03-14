export function getErrorAsString(error?: Error) {
  if (!error) {
    return ''
  }

  if (error.name || error.message) {
    return `Error name: ${error.name}. Error message: ${ error.message }. Error stack: ${ error.stack }`
  } else {
    return JSON.stringify(error)
  }
}
